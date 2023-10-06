import { get, writable } from 'svelte/store';

import { browser } from '$app/environment';
import { APP_THEMES, LOCAL_SETTINGS_KEY } from '$lib/consts';
import Logger from '$lib/logger';

import type { Writable } from 'svelte/store';

const prefersDark = '(prefers-color-scheme: dark)';
const prefersLight = '(prefers-color-scheme: light)';

type Settings = {
  theme: (typeof APP_THEMES)[number];
  reduce_motion: boolean;
};

const defaultSettings = {
  theme: writable<(typeof APP_THEMES)[number]>('dark'),
  reduce_motion: writable<boolean>(false)
} satisfies {
  [key in keyof Settings]: Writable<Settings[key]>;
};

if (browser) {
  const storedSettings = localStorage.getItem(LOCAL_SETTINGS_KEY);
  if (storedSettings) {
    const parsedSettings = JSON.parse(atob(storedSettings));

    parsedSettings.forEach(
      ([key, savedSetting]: [
        key: keyof Settings | string,
        savedSetting: Settings[keyof Settings]
      ]) => {
        if (!(key in defaultSettings)) {
          Logger.warn(`Setting '${key}' does not exist`);
          return;
        }

        // @ts-expect-error Idk how to type this shit properly
        defaultSettings[key].set(savedSetting as never);
      }
    );
  }
}

for (const key in defaultSettings) {
  defaultSettings[key as keyof typeof defaultSettings]?.subscribe(() => {
    if (browser) {
      const settings = Object.entries(defaultSettings).map(([key, setting]) => [
        key,
        // @ts-expect-error Idk how to type this shit properly
        get(setting)
      ]);
      localStorage.setItem(LOCAL_SETTINGS_KEY, btoa(JSON.stringify(settings)));
      document.cookie = `${LOCAL_SETTINGS_KEY}=${btoa(JSON.stringify(settings))}; path=/`;
    }
  });
}

if (browser) {
  window.matchMedia(prefersDark).addEventListener('change', (e) => {
    if (e.matches) {
      defaultSettings.theme.set('dark');
    }
  });

  window.matchMedia(prefersLight).addEventListener('change', (e) => {
    if (e.matches) {
      defaultSettings.theme.set('light');
    }
  });
}

export const loading = writable(false);

export default defaultSettings;
