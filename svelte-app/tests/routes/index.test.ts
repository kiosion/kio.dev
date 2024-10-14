import { expect, test } from '@playwright/test';

import { STUB_CONFIG, STUB_POST } from '../fixtures';
import {
  API_CONFIG_ROUTE,
  API_POST_MANY_ROUTE,
  API_POST_ROUTE,
  stubResponse
} from '../utils';

test('should render index route with data', async ({ context, page }) => {
  await context.route(API_CONFIG_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: STUB_CONFIG }))
  );
  await context.route(API_POST_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: STUB_POST(), meta: { total: 1, count: 1 } }))
  );
  await context.route(API_POST_MANY_ROUTE, (route) =>
    route.fulfill(
      stubResponse({
        data: {
          result: [
            STUB_POST({ id: 'post1', title: 'Post 1', slug: 'post-1' }),
            STUB_POST({ id: 'post2', title: 'Post 2', slug: 'post-2' })
          ],
          meta: { total: 2, count: 2 }
        }
      })
    )
  );

  await page.goto('/');

  await page.waitForSelector('body.is-loaded');
  expect(await page.textContent('div.main')).toContain('About me');
  expect(await page.isVisible('[data-test-id="error-text"]')).toBe(false);
});

test('should render error page on failed data fetch', async ({ context, page }) => {
  await context.route(API_CONFIG_ROUTE, (route) =>
    route.fulfill(stubResponse({ code: 500, errors: ['Failed to fetch config data.'] }))
  );
  await context.route(API_POST_ROUTE, (route) => route.abort());
  await context.route(API_POST_MANY_ROUTE, (route) => route.abort());

  await page.goto('/');

  await page.waitForSelector('body.is-loaded');
  expect(await page.waitForSelector('[data-test-id="error-page"]')).toBeTruthy();

  await page.click('text=Show more');
  expect(await page.textContent('[data-test-id="error-page"]')).toContain(
    'Failed to fetch config data.'
  );
});
