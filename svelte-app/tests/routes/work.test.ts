import { STUB_CONFIG, STUB_PROJECT } from '$tests/fixtures';
import {
  API_CONFIG_ROUTE,
  API_PROJECT_MANY_ROUTE,
  API_PROJECT_ROUTE,
  stubResponse
} from '$tests/utils';

import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.route(API_CONFIG_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: STUB_CONFIG }))
  );
});

test('should render work route with data', async ({ context, page }) => {
  const stubProjects = [
    STUB_PROJECT({ id: 'project1', title: 'Project 1', slug: 'project-1' }),
    STUB_PROJECT({ id: 'project2', title: 'Project 2', slug: 'project-2' })
  ];

  await context.route(API_PROJECT_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: stubProjects[0], meta: { total: 1, count: 1 } }))
  );

  await context.route(API_PROJECT_MANY_ROUTE, (route) =>
    route.fulfill(stubResponse({ data: stubProjects, meta: { total: 2, count: 2 } }))
  );

  await page.goto('/work');

  await page.waitForSelector('body.is-loaded');

  expect(await page.textContent('div.main')).toContain("Where I've worked");

  for (const workExp of STUB_CONFIG.timeline) {
    expect(await page.textContent('div.main')).toContain(workExp.subtitle);
  }

  for (const project of stubProjects) {
    expect(await page.textContent('div.main')).toContain(project.title);
  }
});
