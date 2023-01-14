import { browser } from '$app/environment';
import Logger from '$lib/logger';
import {
  readable,
  writable,
  get,
  type Readable,
  type Writable
} from 'svelte/store';

type Setting = { value: boolean; updated: string };

const defaultFeatureFlags = new Map([
  [
    'reduce_motion',
    writable({ value: false, updated: '1671500535' } as Setting)
  ],
  ['sounds', writable({ value: true, updated: '1671500535' } as Setting)],
  [
    'custom_cursor',
    writable({ value: false, updated: '1671500535' } as Setting)
  ],
  ['comic_sans', writable({ value: false, updated: '1671500535' } as Setting)],
  ['comments', writable({ value: false, updated: '1671500535' } as Setting)],
  ['tooltips', writable({ value: true, updated: '1671509563' } as Setting)],
  ['new_design', writable({ value: false, updated: '1671500535' } as Setting)]
]) as Map<string, Writable<Setting>>;

let featureFlags: typeof defaultFeatureFlags;

if (browser) {
  const storedFlags = localStorage.getItem('featureFlags'),
    parsed = storedFlags
      ? (JSON.parse(atob(storedFlags)) as [string, Setting][])
      : [];
  const writableFlags = new Map(
    parsed
      .filter(([key, savedValue]) => {
        if (!defaultFeatureFlags.has(key)) {
          Logger.warn(`Flag '${key}' does not exist`);
          return false;
        }
        const defaultUpdated = get(
          defaultFeatureFlags.get(key) as Writable<Setting>
        ).updated;
        try {
          return parseInt(defaultUpdated) < parseInt(savedValue.updated);
        } catch {
          return false;
        }
      })
      .map(([key, savedValue]) => [key, writable(savedValue)])
  );

  featureFlags = new Map([...defaultFeatureFlags, ...writableFlags]);
} else {
  featureFlags = defaultFeatureFlags;
}

class FeaturesClass {
  private features: Map<string, Writable<Setting>>;

  constructor(features: Map<string, Writable<Setting>>) {
    this.features = features;
    browser &&
      this.features.forEach((feature) => {
        const key = Array.from(this.features.keys()).find(
          (key) => this.features.get(key) === feature
        ) as string;
        Object.defineProperty(this, key, {
          get: () =>
            readable<boolean>(get(feature).value, (set) => {
              const unsubscribe = feature.subscribe((value) => {
                set(value.value);
              });
              return () => unsubscribe();
            })
        });
        feature.subscribe((_value) => {
          const flags = Array.from(this.features.entries()).map(
            ([key, value]) => [key, get(value)]
          );
          localStorage.setItem('featureFlags', btoa(JSON.stringify(flags)));
        });
      });
  }

  private normalize = (key: string): string => {
    return key
      .replace(/^\s*(use|enable|view|see)*\s*/i, '')
      .replace(/\s+/g, '_')
      .replace(/-/g, '_')
      .toLowerCase();
  };

  can = (key: string): Readable<boolean> => {
    key = this.normalize(key);
    // @ts-expect-error - this[key] is a getter
    if (!this[key]) {
      Logger.warnOnce(`Feature '${key}' does not exist`);
      return readable(false);
    }
    // @ts-expect-error - this[key] is a getter
    return this[key];
  };

  set = (key: string, value: boolean): boolean => {
    key = this.normalize(key);
    if (typeof value !== 'boolean') {
      Logger.warnOnce(`Feature '${key}' must be set to a boolean value`);
      return false;
    }
    if (!this.features.has(key)) {
      Logger.warnOnce(`Feature flag '${key}' does not exist`);
      return false;
    }
    (this.features.get(key) as Writable<Setting>).update((_v) => ({
      value,
      updated: Math.floor(Date.now() / 1000).toString()
    }));
    return true;
  };
}

export default new FeaturesClass(featureFlags);
