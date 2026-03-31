import { test, expect } from '@playwright/test';

test.describe.serial('Authentication Flow', () => {
  const testUsername = `user${Date.now()}`;
  const testPassword = 'securePassword123';

  test('Visits the landing page when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Manage your digital products')).toBeVisible();
    await expect(page.locator('a[href="/signup"]').first()).toBeVisible();
    await expect(page.locator('a[href="/login"]').first()).toBeVisible();
  });

  test('Successfully signs up a new user, automatically logging them in', async ({ page }) => {
    await page.goto('/signup');
    
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*localhost:5173\//);
    await expect(page.locator(`text=${testUsername}`)).toBeVisible(); 
    await expect(page.locator('button', { hasText: 'Logout' })).toBeVisible();
  });

  test('Logs the user out and prevents access to protected routes', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    await page.click('button:has-text("Logout")');
    
    await expect(page).toHaveURL(/.*\/login/);
    
    await page.goto('/products/new');
    await expect(page).toHaveURL(/.*\/login/); 
  });
});
