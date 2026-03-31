import { test, expect } from '@playwright/test';

test.describe.serial('Product CRUD and Validations Flow', () => {
  const testUsername = `user${Date.now()}`;
  const testPassword = 'securePassword123';
  const testProductName = `Awesome Product ${Date.now()}`;
  const testSlug = testProductName.toLowerCase().replace(/\s+/g, '-');

  test.beforeAll(async ({ browser }) => {
    // We register exactly once to perform these product tests securely
    const page = await browser.newPage();
    await page.goto('/signup');
    await page.fill('#signup-username', testUsername);
    await page.fill('#signup-password', testPassword);
    await page.click('#signup-submit-btn');
    await page.waitForURL('/');
    await page.close();
  });

  test('Creates a new product and tests client-side validation', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('#login-username', testUsername);
    await page.fill('#login-password', testPassword);
    await page.click('#login-submit-btn');
    await expect(page).toHaveURL('/');

    // Navigate to Add Product
    // Navigate to Add Product
    await page.click('#pl-add-btn');

    // Fill Product form successfully
    await page.fill('#pf-metaTitle', 'SEO Meta Title Example');
    await page.fill('#pf-name', testProductName);
    
    // Slug auto-generation check
    await expect(page.locator('#pf-slug')).toHaveValue(testSlug);

    await page.fill('#pf-price', '49.99');
    await page.fill('#pf-discountedPrice', '39.99');
    await page.fill('#pf-image-0', 'https://example.com/image.jpg');
    
    // Fill CKEditor
    await page.locator('.ck-editor__editable').fill('This is a rich text description completely filled with details!');

    // Submit Form
    await page.click('#pf-submit-btn');

    // Verify it redirects back to the dashboard immediately
    await expect(page).toHaveURL('/');
  });

  test('Searches for the created product and views details (Frontend <-> Backend List API)', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('#login-username', testUsername);
    await page.fill('#login-password', testPassword);
    await page.click('#login-submit-btn');

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
    await page.fill('#login-username', testUsername);
    await page.fill('#login-password', testPassword);
    await page.click('#login-submit-btn');

    // Ensure we are back at Add Product
    // Ensure we are back at Add Product
    await page.click('#pl-add-btn');

    // Fill Product form with the EXACT same name/slug
    await page.fill('#pf-metaTitle', 'SEO Meta Title Example');
    await page.fill('#pf-name', testProductName);
    await page.fill('#pf-price', '49.99');
    await page.fill('#pf-image-0', 'https://example.com/image.jpg');
    await page.locator('.ck-editor__editable').fill('Description again');

    // Hit create
    await page.click('#pf-submit-btn');

    // Intercept server-side validation error red box appearing!
    await expect(page.locator('.pf-errors')).toBeVisible();
    await expect(page.locator('.pf-errors')).toContainText('already exists');
  });
});
