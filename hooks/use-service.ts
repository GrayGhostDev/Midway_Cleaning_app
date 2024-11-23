import { useState, useCallback } from 'react';
import { serviceFactory } from '@/lib/services/service-factory';
import { useToast } from '@/components/ui/use-toast';

export function useService<T>(serviceName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const service = serviceFactory[`get${serviceName}Service`]();

  const execute = useCallback(async <R>(
    method: keyof T,
    ...args: any[]
  ): Promise<R | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await service[method](...args);
      return result;
    } catch (err) {
      setError(err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [service, toast]);

  return {
    loading,
    error,
    execute,
  };
}