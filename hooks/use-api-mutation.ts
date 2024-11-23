import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  retries?: number;
  retryDelay?: number;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
}

export function useApiMutation<T>(
  mutationFn: (...args: any[]) => Promise<T>,
  options: MutationOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { toast } = useToast();

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
    } catch (err) {
      if (retriesLeft === 0) throw err;
      
      // Don't retry on certain error codes
      if (err.status === 401 || err.status === 403 || err.status === 422) {
        throw err;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      return executeWithRetry(fn, retriesLeft - 1, delay * 2);
    }
  }, []);

  const mutate = async (...args: Parameters<typeof mutationFn>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeWithRetry(
        () => mutationFn(...args),
        options.retries ?? 2,
        options.retryDelay ?? 1000
      );
      
      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }

      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      
      toast({
        title: "Error",
        description: options.errorMessage || apiError.message,
        variant: "destructive",
      });

      options.onError?.(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
    reset: () => setError(null),
  };
}