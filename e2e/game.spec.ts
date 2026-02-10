import { test, expect } from '@playwright/test';

test('game loads and shows canvas + HUD', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Banana Platformer 3D/);
  await expect(page.locator('#status')).toContainText('Reach the red energy core');
  await expect(page.locator('canvas')).toBeVisible();
});
