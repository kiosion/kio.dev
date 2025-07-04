import { browser } from '$app/environment';
import { APP_THEMES, LOCAL_SETTINGS_KEY, MEDIA_QUERIES } from '$lib/consts';
import Logger from '$lib/logger';
import { get, type Writable, writable } from 'svelte/store';
import { useMediaQuery } from 'svelte-breakpoints';

type Settings = {
  theme: (typeof APP_THEMES)[keyof typeof APP_THEMES];
  reduce_motion: boolean;
  modified: boolean;
};

let themeSetting: (typeof APP_THEMES)[keyof typeof APP_THEMES] = APP_THEMES.DARK,
  reduceMotionSetting = false,
  modifiedSetting = false;

const useStoredSettings = (settings?: string) => {
  if (!settings) {
    return false;
  }

  try {
    const parsedSettings = JSON.parse(atob(settings)) as Settings | undefined;

    if (!Array.isArray(parsedSettings)) {
      return false;
    }

    parsedSettings.forEach(([key, savedSetting]) => {
      switch (key) {
        case 'theme':
          if (
            typeof savedSetting === 'string' &&
            Object.values(APP_THEMES).includes(
              savedSetting as (typeof APP_THEMES)[keyof typeof APP_THEMES]
            )
          ) {
            themeSetting = savedSetting as (typeof APP_THEMES)[keyof typeof APP_THEMES];
          }
          break;
        case 'modified':
          if (typeof savedSetting === 'boolean') {
            modifiedSetting = savedSetting;
          }
          break;
        case 'reduce_motion':
          if (typeof savedSetting === 'boolean') {
            reduceMotionSetting = savedSetting;
          }
          break;
      }
    });

    return true;
  } catch (e) {
    Logger.error('Failed to parse localStorage settings', e);
    return false;
  }
};

let storedSettings: string | undefined = undefined;

if (browser) {
  storedSettings = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LOCAL_SETTINGS_KEY}=`))
    ?.split('=')[1];
}

useStoredSettings(storedSettings);

const settings = {
  theme: writable<Settings['theme']>(themeSetting),
  reduce_motion: writable(reduceMotionSetting),
  modified: writable(modifiedSetting)
} as const satisfies { [K in keyof Settings]: Writable<Settings[K]> };

for (const key in settings) {
  settings[key as keyof typeof settings].subscribe(() => {
    if (!browser) {
      return;
    }

    const stringified = btoa(
      JSON.stringify(
        Object.entries(settings).map(([key, setting]) => [
          key,
          get<string | boolean>(setting)
        ])
      )
    );

    document.cookie = `${LOCAL_SETTINGS_KEY}=${stringified}; path=/`;
  });
}

export const listenForMQLChange = () => {
  return [
    // Only update theme if user hasn't manually changed it prior
    useMediaQuery(MEDIA_QUERIES.DARK_THEME).subscribe(
      (val) => val && !get(settings.modified) && settings.theme.set(APP_THEMES.DARK)
    ),
    useMediaQuery(MEDIA_QUERIES.LIGHT_THEME).subscribe(
      (val) => val && !get(settings.modified) && settings.theme.set(APP_THEMES.LIGHT)
    ),
    useMediaQuery(MEDIA_QUERIES.REDUCE_MOTION).subscribe((val) =>
      settings.reduce_motion.set(val)
    )
  ];
};

export const loading = writable(false);

export default settings;
