import { get, writable } from 'svelte/store';

import { browser } from '$app/environment';
import { LOCAL_SETTINGS_KEY } from '$lib/consts';
import Logger from '$lib/logger';

type Setting = boolean | string;

const prefersDark = '(prefers-color-scheme: dark)';
const prefersLight = '(prefers-color-scheme: light)';

const defaultSettings = {
  theme: writable<Setting>('dark'),
  reduce_motion: writable<Setting>(false)
};

if (browser) {
  const storedSettings = localStorage.getItem(LOCAL_SETTINGS_KEY);
  if (storedSettings) {
    const parsedSettings: [string, Setting][] = JSON.parse(atob(storedSettings));

    parsedSettings.forEach(([key, savedSetting]) => {
      if (!(key in defaultSettings)) {
        Logger.warn(`Setting '${key}' does not exist`);
        return;
      }

      defaultSettings[key as keyof typeof defaultSettings].set(savedSetting);
    });
  }
}

for (const key in defaultSettings) {
  defaultSettings[key as keyof typeof defaultSettings]?.subscribe(() => {
    if (browser) {
      const settings = Object.entries(defaultSettings).map(([key, setting]) => [
        key,
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
