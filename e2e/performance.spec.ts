import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance metrics
    await page.coverage.startJSCoverage();
    await page.coverage.startCSSCoverage();
  });

  test.afterEach(async ({ page }) => {
    // Collect coverage data
    const jsCoverage = await page.coverage.stopJSCoverage();
    const cssCoverage = await page.coverage.stopCSSCoverage();

    // Calculate and log coverage
    const jsBytes = jsCoverage.reduce((acc, entry) => acc + entry.text.length, 0);
    const cssBytes = cssCoverage.reduce((acc, entry) => acc + entry.text.length, 0);
    console.log(`JS used: ${jsBytes} bytes`);
    console.log(`CSS used: ${cssBytes} bytes`);
  });

  test('should load dashboard within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to dashboard
    const response = await page.goto('/dashboard');
    const navigationTime = Date.now() - startTime;
    
    // Assert navigation timing
    expect(navigationTime).toBeLessThan(3000); // 3s budget
    expect(response?.status()).toBe(200);

    // Check Time to First Byte
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        ttfb: nav.responseStart - nav.requestStart,
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime,
      };
    });

    expect(timing.ttfb).toBeLessThan(600); // 600ms TTFB budget
    expect(timing.fcp).toBeLessThan(1000); // 1s FCP budget
    expect(timing.lcp).toBeLessThan(2500); // 2.5s LCP budget
  });

  test('should maintain responsive UI during data loading', async ({ page }) => {
    await page.goto('/dashboard');

    // Simulate slow network
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
      await route.continue();
    });

    const startTime = Date.now();

    // Click navigation and measure response time
    await page.getByRole('link', { name: 'Customers' }).click();
    const responseTime = Date.now() - startTime;

    // UI should remain responsive during loading
    expect(responseTime).toBeLessThan(100); // UI response within 100ms
    await expect(page.getByRole('progressbar')).toBeVisible(); // Loading indicator shown
  });

  test('should efficiently handle large data sets', async ({ page }) => {
    await page.goto('/dashboard/customers');

    // Measure time to render large customer list
    const startTime = Date.now();
    await page.getByRole('table').waitFor();
    const renderTime = Date.now() - startTime;

    expect(renderTime).toBeLessThan(1000); // 1s render budget

    // Test search performance
    const searchStartTime = Date.now();
    await page.getByPlaceholder('Search customers...').fill('John');
    const searchTime = Date.now() - searchStartTime;

    expect(searchTime).toBeLessThan(200); // 200ms search response budget
  });

  test('should maintain performance during continuous interaction', async ({ page }) => {
    await page.goto('/dashboard');

    // Measure performance during rapid navigation
    for (const section of ['Customers', 'Schedule', 'Reports']) {
      const startTime = Date.now();
      await page.getByRole('link', { name: section }).click();
      const navigationTime = Date.now() - startTime;
      expect(navigationTime).toBeLessThan(300); // 300ms navigation budget
    }

    // Memory leak check
    const metrics = await page.metrics();
    expect(metrics.JSHeapUsedSize).toBeLessThan(50 * 1024 * 1024); // 50MB heap budget
  });

  test('should optimize image loading', async ({ page }) => {
    await page.goto('/dashboard');

    // Check image optimization
    const images = await page.evaluate(() => {
      return Array.from(document.images).map(img => ({
        src: img.src,
        width: img.width,
        height: img.height,
        loading: img.loading,
      }));
    });

    for (const img of images) {
      // Verify lazy loading
      expect(img.loading).toBe('lazy');
      
      // Verify appropriate dimensions
      expect(img.width).toBeGreaterThan(0);
      expect(img.height).toBeGreaterThan(0);
      
      // Verify optimized format
      expect(img.src).toMatch(/\.(webp|avif)$/);
    }
  });
});
