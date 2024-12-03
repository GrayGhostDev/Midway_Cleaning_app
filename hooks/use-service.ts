import { useState, useCallback } from 'react';
import { serviceFactory } from '@/lib/services/service-factory';
import { useToast } from '@/components/ui/use-toast';

type ServiceName = 'Service' | 'Booking';

export function useService<T>(serviceName: ServiceName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const getServiceMethod = `get${serviceName}Service` as const;
  const service = serviceFactory[getServiceMethod]() as T;

  const execute = useCallback(async <R>(
    method: keyof T,
    ...args: any[]
  ): Promise<R | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await (service[method] as Function)(...args);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      toast({
        title: "Error",
        description: error.message,
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