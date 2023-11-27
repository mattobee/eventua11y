// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('has title', async ({ page, baseURL }) => {
  await page.goto(baseURL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Eventua11y/);

});

test('has no accessibility violations', async ({ page, baseURL }) => {
  await page.goto(baseURL);
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});