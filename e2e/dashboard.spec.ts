import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display dashboard components', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Sidebar' })).toBeVisible();
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    // Test navigation to different sections
    await page.getByRole('link', { name: 'Customers' }).click();
    await expect(page).toHaveURL('/dashboard/customers');
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();

    await page.getByRole('link', { name: 'Schedule' }).click();
    await expect(page).toHaveURL('/dashboard/schedule');
    await expect(page.getByRole('heading', { name: 'Schedule' })).toBeVisible();

    await page.getByRole('link', { name: 'Reports' }).click();
    await expect(page).toHaveURL('/dashboard/reports');
    await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
  });

  test('should display and interact with customer list', async ({ page }) => {
    await page.getByRole('link', { name: 'Customers' }).click();
    
    // Test customer search
    await page.getByPlaceholder('Search customers...').fill('John');
    await expect(page.getByText('John Doe')).toBeVisible();
    
    // Test customer details
    await page.getByText('John Doe').click();
    await expect(page.getByRole('heading', { name: 'Customer Details' })).toBeVisible();
    await expect(page.getByText('john.doe@example.com')).toBeVisible();
  });

  test('should handle schedule management', async ({ page }) => {
    await page.getByRole('link', { name: 'Schedule' }).click();
    
    // Test calendar navigation
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.getByRole('button', { name: 'Previous month' }).click();
    
    // Test appointment creation
    await page.getByRole('button', { name: 'New Appointment' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByLabel('Customer').click();
    await page.getByText('John Doe').click();
    await page.getByLabel('Date').fill('2024-03-15');
    await page.getByLabel('Time').fill('14:00');
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify appointment was created
    await expect(page.getByText('Appointment scheduled')).toBeVisible();
  });

  test('should generate and display reports', async ({ page }) => {
    await page.getByRole('link', { name: 'Reports' }).click();
    
    // Test report generation
    await page.getByRole('button', { name: 'Generate Report' }).click();
    await page.getByLabel('Start Date').fill('2024-01-01');
    await page.getByLabel('End Date').fill('2024-03-01');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify report content
    await expect(page.getByText('Report Generated')).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should handle user settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings' }).click();
    
    // Test profile update
    await page.getByLabel('Name').fill('Updated Name');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();
    
    // Test password change
    await page.getByRole('button', { name: 'Change Password' }).click();
    await page.getByLabel('Current Password').fill('password123');
    await page.getByLabel('New Password').fill('newpassword123');
    await page.getByLabel('Confirm Password').fill('newpassword123');
    await page.getByRole('button', { name: 'Update Password' }).click();
    await expect(page.getByText('Password updated successfully')).toBeVisible();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test network error handling
    await page.route('**/api/customers', route => route.abort());
    await page.getByRole('link', { name: 'Customers' }).click();
    await expect(page.getByText('Error loading customers')).toBeVisible();
    
    // Test form error handling
    await page.getByRole('link', { name: 'Schedule' }).click();
    await page.getByRole('button', { name: 'New Appointment' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Please fill in all required fields')).toBeVisible();
  });
});
