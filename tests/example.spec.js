// @ts-check
const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('axe-playwright');

test('has title', async ({ page, baseURL }) => {
  await page.goto(baseURL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Eventua11y/);

});

test('has no accessibility violations', async ({ page, baseURL }) => {
  await page.goto(baseURL);

  const builder = new AxeBuilder({ page });
  const results = await builder.analyze();

  expect(results.violations).toHaveLength(0);
});