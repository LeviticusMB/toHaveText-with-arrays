import { test, expect } from '@playwright/test';
import { expect as baseExpect, ExpectMatcherState, MatcherReturnType } from '@playwright/test';

import matchers from './matchers.cjs'
const { toHaveText } = (matchers as any).default ?? matchers;

const dateExpect = baseExpect.extend({
  async toHaveText(this: ExpectMatcherState, date: Date, expected: string | RegExp, options?: { ignoreCase?: boolean, timeout?: number }): Promise<MatcherReturnType> {
    if (date instanceof Date) {
      try {
        if (expected instanceof RegExp) {
          baseExpect(date.toISOString()).toMatch(expected);
        } else {
          baseExpect(date.toISOString()).toBe(expected);
        }
        return { pass: true, message: () => `Expected ${date.toISOString()} not to have text ${expected}` };
      } catch (error: any) {
        return { pass: false, message: () => error.message, expected, actual: error.matcherResult?.accept };
      }
    } else {
      return toHaveText.call(this, date, expected, options);
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
