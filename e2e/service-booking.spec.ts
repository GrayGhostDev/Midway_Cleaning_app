import { test, expect } from '@playwright/test';

test.describe('Service Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test data and authenticate
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('testpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('should successfully book a cleaning service', async ({ page }) => {
    // Navigate to booking page
    await page.getByRole('link', { name: 'Book Service' }).click();
    await expect(page).toHaveURL('/book');

    // Fill booking form
    await page.getByLabel('Service Type').selectOption('deep-cleaning');
    await page.getByLabel('Date').fill('2024-02-01');
    await page.getByLabel('Time').selectOption('10:00');
    await page.getByLabel('Address').fill('123 Test St');
    await page.getByLabel('Special Instructions').fill('Please clean windows thoroughly');

    // Submit booking
    await page.getByRole('button', { name: 'Book Now' }).click();

    // Verify booking confirmation
    await expect(page.getByText('Booking Confirmed')).toBeVisible();
    await expect(page.getByText('Booking ID:')).toBeVisible();
  });

  test('should show real-time updates for ongoing service', async ({ page }) => {
    // Navigate to service tracking page
    await page.goto('/services/active');
    
    // Wait for WebSocket connection
    await page.waitForSelector('[data-testid="connection-status"]');
    await expect(page.getByText('Connected')).toBeVisible();

    // Verify service status updates
    await expect(page.getByTestId('service-status')).toBeVisible();
    await expect(page.getByTestId('progress-bar')).toBeVisible();

    // Test chat functionality
    await page.getByPlaceholderText('Type a message...').fill('Is everything going well?');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByText('Is everything going well?')).toBeVisible();
  });

  test('should handle payment flow', async ({ page }) => {
    // Navigate to payment page
    await page.goto('/services/completed');
    await page.getByRole('button', { name: 'Pay Now' }).first().click();

    // Fill payment details
    await page.frameLocator('iframe[name="stripe-card-number"]')
      .getByRole('textbox').fill('4242424242424242');
    await page.frameLocator('iframe[name="stripe-card-expiry"]')
      .getByRole('textbox').fill('1230');
    await page.frameLocator('iframe[name="stripe-card-cvc"]')
      .getByRole('textbox').fill('123');

    // Submit payment
    await page.getByRole('button', { name: 'Pay' }).click();

    // Verify payment success
    await expect(page.getByText('Payment Successful')).toBeVisible();
    await expect(page.getByText('Receipt')).toBeVisible();
  });

  test('should handle notifications', async ({ page }) => {
    // Open notification center
    await page.getByRole('button', { name: 'Open notifications' }).click();

    // Verify notification list
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
    
    // Mark notification as read
    await page.getByTestId('notification-item').first().click();
    await expect(page.getByTestId('unread-badge')).toHaveCount(0);

    // Clear notifications
    await page.getByRole('button', { name: 'Clear all' }).click();
    await expect(page.getByText('No notifications')).toBeVisible();
  });
});
