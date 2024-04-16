import { get, writable } from 'svelte/store';

import { useMediaQuery } from 'svelte-breakpoints';

import { browser } from '$app/environment';
import { APP_THEMES, LOCAL_SETTINGS_KEY, MEDIA_QUERIES } from '$lib/consts';
import Logger from '$lib/logger';

type Settings = {
  theme: (typeof APP_THEMES)[keyof typeof APP_THEMES];
  reduce_motion: boolean;
};

const defaultSettings = {
  theme: writable<(typeof APP_THEMES)[keyof typeof APP_THEMES]>('dark'),
  reduce_motion: writable<boolean>(false)
} as const;

if (browser) {
  const storedSettings = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LOCAL_SETTINGS_KEY}=`))
    ?.split('=')[1];

  if (storedSettings) {
    try {
      const parsedSettings = JSON.parse(atob(storedSettings)) as Settings | undefined;

      if (
        typeof parsedSettings?.theme === 'string' &&
        Object.values(APP_THEMES).includes(parsedSettings.theme)
      ) {
        defaultSettings.theme.set(parsedSettings.theme);
      }
      if (typeof parsedSettings?.reduce_motion === 'boolean') {
        defaultSettings.reduce_motion.set(parsedSettings.reduce_motion);
      }
    } catch (e) {
      Logger.error('Failed to parse localStorage settings', e);
    }
  }
}

for (const key in defaultSettings) {
  defaultSettings[key as keyof typeof defaultSettings].subscribe(() => {
    if (!browser) {
      return;
    }

    const settings = btoa(
      JSON.stringify(
        Object.entries(defaultSettings).map(([key, setting]) => [
          key,
          get<string | boolean>(setting)
        ])
      )
    );

    document.cookie = `${LOCAL_SETTINGS_KEY}=${settings}; path=/`;
  });
}

if (browser) {
  useMediaQuery(MEDIA_QUERIES.DARK_THEME).subscribe(
    (val) => val && defaultSettings.theme.set(APP_THEMES.DARK)
  );
  useMediaQuery(MEDIA_QUERIES.LIGHT_THEME).subscribe(
    (val) => val && defaultSettings.theme.set(APP_THEMES.LIGHT)
  );
  useMediaQuery(MEDIA_QUERIES.REDUCE_MOTION).subscribe((val) =>
    defaultSettings.reduce_motion.set(val)
  );
}

export const loading = writable(false);

export default defaultSettings;
