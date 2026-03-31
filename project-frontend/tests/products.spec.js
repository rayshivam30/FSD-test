import { test, expect } from '@playwright/test';

test.describe.serial('Product CRUD and Validations Flow', () => {
  const testUsername = `user${Date.now()}`;
  const testPassword = 'securePassword123';
  const testProductName = `Awesome Product ${Date.now()}`;
  const testSlug = testProductName.toLowerCase().replace(/\s+/g, '-');

  test.beforeAll(async ({ browser }) => {
    // We register exactly once to perform these product tests securely
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/signup');
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*localhost:5173\//);
    await page.close();
  });

  test('Creates a new product and tests client-side validation', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*localhost:5173\//);

    // Navigate to Add Product
    await page.click('a:has-text("+ Add Product")');

    // Fill Product form successfully
    await page.fill('input[name="metaTitle"]', 'SEO Meta Title Example');
    await page.fill('input[name="name"]', testProductName);
    
    // Slug auto-generation check (should be instantaneous)
    await expect(page.locator('input[name="slug"]')).toHaveValue(testSlug);

    await page.fill('input[name="price"]', '49.99');
    await page.fill('input[name="discountedPrice"]', '39.99');
    await page.fill('input[type="url"]', 'https://example.com/image.jpg');
    
    // Fill CKEditor (Rich Text Integration)
    await page.locator('.ck-editor__editable').fill('This is a rich text description completely filled with details!');

    // Submit Form
    await page.click('button[type="submit"]');

    // Verify it redirects back to the dashboard immediately (Frontend <-> Backend API Success)
    await expect(page).toHaveURL(/.*localhost:5173\//);
  });

  test('Searches for the created product and views details (Frontend <-> Backend List API)', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Make sure we are on dashboard
    await expect(page.locator('text=SEO Meta Title Example').first()).toBeVisible();

    // Click on the specific product item we just created using its explicit frontend route href
    await page.locator(`a[href='/products/${testSlug}']`).click();
    
    // Check product details page logic
    await expect(page).toHaveURL(new RegExp(`.*\\/products\\/${testSlug}`));
    await expect(page.locator('.pd-name')).toContainText(testProductName);
    await expect(page.locator('.pd-desc-content')).toContainText('This is a rich text description completely filled with details!');
  });

  test('Triggers strict server-side validation error (409 Conflict logic)', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', testUsername);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Ensure we are back at Add Product
    await page.click('a:has-text("+ Add Product")');

    // Fill Product form with the EXACT same name/slug to trigger 409 validation error from Mongoose
    await page.fill('input[name="metaTitle"]', 'SEO Meta Title Example');
    await page.fill('input[name="name"]', testProductName);
    await page.fill('input[name="price"]', '49.99');
    await page.fill('input[type="url"]', 'https://example.com/image.jpg');
    await page.locator('.ck-editor__editable').fill('Description again');

    // Hit create
    await page.click('button[type="submit"]');

    // Intercept server-side validation error red box appearing!
    await expect(page.locator('.pf-errors')).toBeVisible();
    await expect(page.locator('.pf-errors')).toContainText('A product with this slug already exists.');
  });
});
