import { expect, test } from '@playwright/test';

import { STUB_CONFIG, STUB_POST } from '../fixtures';
import {
  API_CONFIG_ROUTE,
  API_POST_MANY_ROUTE,
  API_POST_ROUTE,
  API_PROJECT_ROUTE,
  stubResponse
} from '../utils';

test('handles config load error', async ({ context, page }) => {
  await context.route(API_CONFIG_ROUTE, (route) =>
    route.fulfill(stubResponse({ code: 500, errors: ['Failed to fetch config data.'] }))
  );

  await context.route(API_POST_MANY_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: [STUB_POST()] }))
  );

  await page.goto('/');

  await page.waitForSelector('[data-test-id="error-page"]', {
    timeout: 4000
  });

  await page.click('text=See more');

  expect(await page.textContent('[data-test-id="error-page"]')).toContain(
    'Failed to fetch config data.'
  );
});

test('handles project load error', async ({ context, page }) => {
  await context.route(API_CONFIG_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: STUB_CONFIG }))
  );

  await context.route(API_PROJECT_ROUTE, (route) =>
    route.fulfill(stubResponse({ code: 404, errors: ['Project not found.'] }))
  );

  await page.goto('/work/project-3');

  await page.waitForSelector('[data-test-id="error-page"]', {
    timeout: 4000
  });

  await page.click('text=See more');

  expect(await page.textContent('[data-test-id="error-page"]')).toContain(
    '404: Not Found'
  );
  expect(await page.textContent('[data-test-id="error-page"]')).toContain(
    'Project not found.'
  );
});

test('handles post load error', async ({ context, page }) => {
  await context.route(API_CONFIG_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: STUB_CONFIG }))
  );

  await context.route(API_POST_ROUTE, (route) =>
    route.fulfill(stubResponse({ code: 404, errors: ['Post not found.'] }))
  );

  await page.goto('/thoughts/post-3');

  await page.waitForSelector('[data-test-id="error-page"]', {
    timeout: 4000
  });

  await page.click('text=See more');

  expect(await page.textContent('[data-test-id="error-page"]')).toContain(
    '404: Not Found'
  );
  expect(await page.textContent('[data-test-id="error-page"]')).toContain(
    'Post not found.'
  );
});
