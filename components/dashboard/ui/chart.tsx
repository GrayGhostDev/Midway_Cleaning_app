import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { DashboardCard } from './card';
import { Skeleton } from '@/components/ui/skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  title?: string;
  description?: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
    }>;
  };
  height?: number;
  options?: any;
  isLoading?: boolean;
}

export function Chart({ title, description, data, height = 350, options, isLoading = false }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <DashboardCard title={title} description={description}>
      <div style={{ height }} className="relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <Line data={data} options={options || defaultOptions} />
        )}
      </div>
    </DashboardCard>
  );
}
