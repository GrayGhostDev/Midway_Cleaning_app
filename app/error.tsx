'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Something went wrong!</h1>
        <p className="text-muted-foreground">
          An error occurred while loading this page.
        </p>
      </div>
      <Button
        onClick={() => reset()}
        variant="outline"
      >
        Try again
      </Button>
    </div>
  );
}
