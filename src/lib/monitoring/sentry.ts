// Sentry stub -- @sentry/nextjs is not installed.
// Install @sentry/nextjs when error monitoring is needed.

export const initializeSentry = () => {
  console.log('[SENTRY STUB] initializeSentry -- no-op');
};

export const captureException = (error: Error, context?: Record<string, unknown>) => {
  console.error('[SENTRY STUB] captureException:', error.message, context);
};

export const captureMessage = (message: string, context?: Record<string, unknown>) => {
  console.log('[SENTRY STUB] captureMessage:', message, context);
};

export const setUserContext = (user: { id: string; email: string }) => {
  console.log('[SENTRY STUB] setUserContext:', user.id);
};

export const clearUserContext = () => {
  console.log('[SENTRY STUB] clearUserContext');
};

export const monitorPerformance = (name: string, fn: () => Promise<unknown>) => {
  const startTime = performance.now();
  return fn().finally(() => {
    const duration = performance.now() - startTime;
    console.log(`[SENTRY STUB] Performance: ${name} took ${duration.toFixed(2)}ms`);
  });
};
