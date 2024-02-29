import { expect, test } from '@playwright/test';
import { toPlainText } from '@portabletext/toolkit';

import { STUB_CONFIG } from '../fixtures';
import { API_CONFIG_ROUTE, stubResponse } from '../utils';

test.beforeEach(async ({ context }) => {
  await context.route(API_CONFIG_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: STUB_CONFIG }))
  );
});

test('should render etc route with data', async ({ context, page }) => {
  const SECTIONS = STUB_CONFIG.meta.map((sec) => {
    return {
      title: sec.title,
      body: toPlainText(sec.content)
    };
  });

  await page.goto('/etc');

  await page.waitForSelector('body.is-loaded');

  for (const SECTION of SECTIONS) {
    expect(await page.textContent('div.main')).toContain(SECTION.title);
    expect(await page.textContent('div.main')).toContain(SECTION.body);
  }
});
