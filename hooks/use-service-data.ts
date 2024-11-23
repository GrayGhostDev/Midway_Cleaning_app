import { useState, useEffect } from 'react';
import { serviceFactory } from '@/lib/services/service-factory';
import { useToast } from '@/components/ui/use-toast';

export function useServiceData() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const serviceService = serviceFactory.getServiceService();

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch (error) {
      setError(error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    services,
    loading,
    error,
    refresh: loadServices,
  };
}