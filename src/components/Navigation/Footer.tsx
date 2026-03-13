'use client';

export function FooterFallback() {
  return (
    <div className="h-12 bg-background border-t animate-pulse" />
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-background px-6 py-3">
      <p className="text-sm text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} Midway Cleaning Co. All rights reserved.
      </p>
    </footer>
  );
}
