import { cn } from '@/lib/utils';
import { DashboardCard } from './card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
  isLoading = false,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <DashboardCard className={cn('relative overflow-hidden', className)}>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32 mt-2" />
            {description && <Skeleton className="h-4 w-48 mt-2" />}
            {trend && <Skeleton className="h-4 w-16 mt-2" />}
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className={cn('relative overflow-hidden', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                'mt-2 text-sm font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 p-2.5 text-primary">
          {icon}
        </div>
      </div>
    </DashboardCard>
  );
}
