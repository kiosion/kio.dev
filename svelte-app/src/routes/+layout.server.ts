import Logger from '$lib/logger';
import Store from '$lib/store';

import type { LayoutServerLoad } from './$types';
import type { AuthorDocument } from '$types';

export const trailingSlash = 'ignore';

export const load = (async ({ cookies, url, fetch }) => {
  let theme = '';

  const settings = cookies.get('settings');

  if (settings) {
    try {
      const parsed_settings = JSON.parse(atob(settings) || '{}');

      if (Array.isArray(parsed_settings)) {
        parsed_settings.forEach(([key, savedSetting]) => {
          if (key === 'theme') {
            theme = savedSetting;
          }
        });
      }
    } catch {
      Logger.error('Failed to parse settings cookie');
    }
  }

  if (!['dark', 'light'].includes(theme)) {
    theme = 'dark';
  }

  const promises = await Promise.all([
    Store.findOne<AuthorDocument>(fetch, 'about')
      .then((res) => res?.data)
      .catch((err: unknown) => {
        Logger.error(err as string);
        return undefined;
      }),
    Store.findConfig(fetch).catch((err: unknown) => {
      Logger.error(`Failed to load config: ${err}`);
    })
  ]);

  return { theme, pathname: url.pathname, author: promises[0], config: promises[1] };
}) satisfies LayoutServerLoad;