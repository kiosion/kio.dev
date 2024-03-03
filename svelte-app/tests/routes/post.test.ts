import { expect, test } from '@playwright/test';

import { STUB_CONFIG, STUB_POST } from '../fixtures';
import { API_CONFIG_ROUTE, API_POST_ROUTE, stubResponse } from '../utils';

test.beforeEach(async ({ context }) => {
  await context.route(API_CONFIG_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: STUB_CONFIG }))
  );
});

test('should load single post with body data', async ({ context, page }) => {
  await context.route(API_POST_ROUTE, (route) =>
    route.fulfill(
      stubResponse({
        data: STUB_POST({
          id: 'post1',
          title: 'Post 1',
          slug: 'post-1',
          body: [
            {
              _key: '6c86785e0bc3',
              _type: 'block',
              children: [
                {
                  _key: 'c76b5cdbceef0',
                  _type: 'span',
                  marks: [],
                  text: 'Short body paragraph here.'
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ]
        })
      })
    )
  );

  await page.goto('/thoughts/post-1');

  await page.waitForSelector('body.is-loaded');

  expect(await page.textContent('div.main')).toContain('Post 1');
  expect(await page.textContent('div.main')).toContain('Short body paragraph here.');
});
