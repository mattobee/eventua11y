// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page, baseURL }) => {
  await page.goto(baseURL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Eventua11y/);
});

