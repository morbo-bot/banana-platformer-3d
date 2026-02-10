import { test, expect } from '@playwright/test';

test('published game page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Banana Platformer 3D/);
  await expect(page.locator('canvas')).toBeVisible();
});
