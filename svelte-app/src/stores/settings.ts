import { get, type Writable, writable } from 'svelte/store';

import { browser } from '$app/environment';
import Logger from '$lib/logger';

type Setting = boolean | string;
type SettingStore = Writable<Setting>;

interface Settings {
  [key: string]: SettingStore;
}

const prefersDark = '(prefers-color-scheme: dark)';
const prefersLight = '(prefers-color-scheme: light)';

// Default settings values
const defaultSettings: Settings = {
  theme: writable<Setting>('dark'),
  reduce_motion: writable<Setting>(false),
  sounds: writable<Setting>(true),
  comic_sans: writable<Setting>(false)
};

// Load settings from local storage if available
if (browser) {
  const storedSettings = localStorage.getItem('settings');
  if (storedSettings) {
    const parsedSettings: [string, Setting][] = JSON.parse(atob(storedSettings));

    parsedSettings.forEach(([key, savedSetting]) => {
      if (!(key in defaultSettings)) {
        Logger.warn(`Setting '${key}' does not exist`);
        return;
      }

      defaultSettings[key].set(savedSetting);
    });
  }
}

// Automatically save changes to local storage
for (const key in defaultSettings) {
  defaultSettings[key].subscribe(() => {
    if (browser) {
      const settings = Object.entries(defaultSettings).map(([key, setting]) => [
        key,
        get(setting)
      ]);
      localStorage.setItem('settings', btoa(JSON.stringify(settings)));
      document.cookie = `settings=${btoa(JSON.stringify(settings))}; path=/`;
    }
  });
}

// Handle changes in system theme
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
