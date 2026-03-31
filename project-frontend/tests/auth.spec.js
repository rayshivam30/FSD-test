import { test, expect } from '@playwright/test';

test.describe.serial('Authentication Flow', () => {
  const testUsername = `user${Date.now()}`;
  const testPassword = 'securePassword123';

  test('Visits the landing page when not authenticated', async ({ page }) => {
    await page.goto('/');
    // Check for segments of the new premium heading
    await expect(page.locator('h1.lp-h1')).toContainText('Your catalog');
    await expect(page.locator('h1.lp-h1')).toContainText('beautifully');
    
    // Check for the header login/signup links
    await expect(page.locator('#nav-signup-link')).toBeVisible();
    await expect(page.locator('#nav-login-link')).toBeVisible();
  });

  test('Successfully signs up a new user, automatically logging them in', async ({ page }) => {
    await page.goto('/signup');
    
    await page.fill('#signup-username', testUsername);
    await page.fill('#signup-password', testPassword);
    await page.click('#signup-submit-btn');

    await expect(page).toHaveURL(/.*localhost:5173\//);
    await expect(page.locator('.nb-username')).toHaveText(testUsername); 
    await expect(page.locator('#nav-logout-btn')).toBeVisible();
  });

  test('Logs the user out and prevents access to protected routes', async ({ page }) => {
    await page.goto('/login');
    // Using ID-based selection for reliability with new premium layout
    await page.fill('#login-username', testUsername || 'testuser'); 
    await page.fill('#login-password', testPassword || 'password123');
    await page.click('#login-submit-btn');
    
    await page.click('#nav-logout-btn');
    
    await expect(page).toHaveURL(/.*\/login/);
    
    await page.goto('/products/new');
    await expect(page).toHaveURL(/.*\/login/); 
  });
});
