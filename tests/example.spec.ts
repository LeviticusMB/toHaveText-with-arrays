import { test, expect } from '@playwright/test';
import { expect as baseExpect, ExpectMatcherState, Locator, MatcherReturnType } from '@playwright/test';

const dateExpect = baseExpect.extend({
  async toHaveText(this: ExpectMatcherState, date: Date, expected: string | RegExp, options?: { ignoreCase?: boolean, timeout?: number }): Promise<MatcherReturnType> {
    try {
      if (date instanceof Date) {
        if (expected instanceof RegExp) {
          baseExpect(date.toISOString()).toMatch(expected);
        } else {
          baseExpect(date.toISOString()).toBe(expected);
        }
      } else {
        baseExpect(date as Locator).toHaveText(expected, options);
      }

      return { pass: true, message: () => 'Date is correct' };
    } catch (error: any) {
      return { pass: false, message: () => error.message, expected, actual: error.matcherResult?.accept };
    }
  },
});

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('contain text', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page.locator('nav ul a')).toHaveCount(4);
  await expect(page.locator('nav ul a')).toHaveText(['Node.js', 'Python', 'Java', '.NET']);
});

test('date text', async ({ page }) => {
  await dateExpect(new Date()).toHaveText(/2024/);
});
