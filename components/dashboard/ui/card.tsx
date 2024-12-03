import { cn } from '@/lib/utils';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

export function DashboardCard({
  title,
  description,
  footer,
  children,
  isLoading,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-white text-card-foreground shadow',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="p-6 pb-4">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children && <div className="p-6 pt-0">{children}</div>}
      {footer && (
        <div className="border-t bg-muted/50 p-4 sm:px-6">{footer}</div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
