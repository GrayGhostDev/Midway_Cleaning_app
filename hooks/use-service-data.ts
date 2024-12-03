import { useState, useEffect } from 'react';
import { serviceFactory } from '@/lib/services/service-factory';
import { useToast } from '@/components/ui/use-toast';

interface ServiceRequirements {
  equipment: string[];
  supplies: string[];
  certifications: string[];
}

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  duration: string;
  rate: number;
  rateUnit: string;
  staffRequired: number;
  status: string;
  utilization: number;
  lastUpdated: string;
  requirements: ServiceRequirements;
}

export function useServiceData() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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
      setError(error instanceof Error ? error : new Error('Failed to load services'));
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