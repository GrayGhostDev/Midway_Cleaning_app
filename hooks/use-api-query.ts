import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface QueryOptions<T> {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  errorMessage?: string;
  cacheTime?: number;
  pollInterval?: number;
  retries?: number;
  retryDelay?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const queryCache = new Map<string, CacheEntry<any>>();

interface ApiError extends Error {
  status?: number;
  code?: string;
}

export function useApiQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: QueryOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const { toast } = useToast();
  const pollTimeoutRef = useRef<NodeJS.Timeout>();

  const handleApiError = useCallback((err: any): ApiError => {
    if (err.response) {
      return {
        name: 'ApiError',
        message: err.response.data?.message || 'An error occurred',
        status: err.response.status,
        code: err.response.data?.code,
      };
    }
    return err;
  }, []);

  const executeWithRetry = useCallback(async (
    fn: () => Promise<T>,
    retriesLeft: number,
    delay: number
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      const err = error as ApiError;
      if (retriesLeft === 0) throw err;
      
      // Don't retry on certain error codes
      if (err.status === 401 || err.status === 403 || err.status === 422) {
        throw err;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      return executeWithRetry(fn, retriesLeft - 1, delay * 2);
    }
  }, []);

  const getCachedData = useCallback(() => {
    const cached = queryCache.get(queryKey);
    if (!cached) return null;

    const cacheTime = options.cacheTime ?? 5 * 60 * 1000; // 5 minutes default
    if (Date.now() - cached.timestamp > cacheTime) {
      queryCache.delete(queryKey);
      return null;
    }

    return cached.data;
  }, [queryKey, options.cacheTime]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      const result = await executeWithRetry(
        queryFn,
        options.retries ?? 2,
        options.retryDelay ?? 1000
      );

      // Cache the result
      queryCache.set(queryKey, {
        data: result,
        timestamp: Date.now(),
      });

      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      
      toast({
        title: "Error",
        description: options.errorMessage || apiError.message,
        variant: "destructive",
      });

      options.onError?.(apiError);
    } finally {
      setLoading(false);
    }
  }, [
    queryKey,
    queryFn,
    options,
    executeWithRetry,
    getCachedData,
    handleApiError,
    toast,
  ]);

  useEffect(() => {
    if (options.enabled === false) {
      setLoading(false);
      return;
    }

    void fetchData();

    // Setup polling if interval is provided
    if (options.pollInterval) {
      pollTimeoutRef.current = setInterval(fetchData, options.pollInterval);
    }

    return () => {
      if (pollTimeoutRef.current) {
        clearInterval(pollTimeoutRef.current);
      }
    };
  }, [options.enabled, options.pollInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}