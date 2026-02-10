import { test, expect } from '@playwright/test';

test('published game page loads', async ({ page }) => {
  test.setTimeout(180000);

  let title = '';
  for (let i = 0; i < 24; i++) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    title = await page.title();
    if (/Banana Platformer 3D/i.test(title)) break;
    await page.waitForTimeout(5000);
  }

  expect(title).toMatch(/Banana Platformer 3D/i);
  await expect(page.locator('canvas')).toBeVisible();
});
