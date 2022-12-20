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
    'reduce-motion',
    writable({ value: false, updated: '1671500535' } as Setting)
  ],
  ['sounds', writable({ value: true, updated: '1671500535' } as Setting)],
  [
    'custom-cursor',
    writable({ value: false, updated: '1671500535' } as Setting)
  ],
  ['comic-sans', writable({ value: false, updated: '1671500535' } as Setting)],
  ['comments', writable({ value: false, updated: '1671500535' } as Setting)],
  ['tooltips', writable({ value: false, updated: '1671500535' } as Setting)]
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
        } catch (_e) {
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
      featureFlags.forEach((feature) => {
        feature.subscribe((value) => {
          const flags = Array.from(featureFlags.entries()).map(
            ([key, value]) => [key, get(value)]
          );
          localStorage.setItem('featureFlags', btoa(JSON.stringify(flags)));
        });
      });
  }

  private normalize = (key: string): string => {
    key = key.toString().replace(/\s+/g, '-').toLowerCase();
    key = key.replace(/^-*(use|enable|view|see|feature)-*/i, '');
    return key;
  };

  can = (key: string): Readable<boolean> => {
    key = this.normalize(key);
    if (!this.features.has(key)) {
      Logger.warnOnce(`Feature '${key}' does not exist`);
      return readable(false);
    }
    return readable<boolean>(
      get(this.features.get(key) as Writable<Setting>).value as boolean,
      (set) => {
        const unsubscribe = (
          this.features.get(key) as Writable<Setting>
        ).subscribe((value) => {
          set(value.value);
        });
        return () => unsubscribe();
      }
    );
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

// const featuresHandler = {
//   get: (target: typeof featureFlags, prop: string) => {
//     let dashedProp = prop
//       .toString()
//       .replace(/([a-z])([A-Z])/g, '$1-$2')
//       .toLowerCase();
//     if (
//       dashedProp.split('-')[0] === 'use' ||
//       dashedProp.split('-')[0] === 'enable' ||
//       dashedProp.split('-')[0] === 'view'
//     ) {
//       dashedProp = dashedProp.split('-').slice(1).join('-');
//     }

//     if (target.has(dashedProp)) {
//       return readable<boolean>(
//         get(target.get(dashedProp) as Writable<Setting>).value as boolean,
//         (set) => {
//           const unsubscribe = (
//             target.get(dashedProp) as Writable<Setting>
//           ).subscribe((value) => {
//             set(value.value);
//           });
//           return () => unsubscribe();
//         }
//       );
//     } else {
//       Logger.error(`Error: Feature flag '${prop}' does not exist`);
//       return readable(false);
//     }
//   },
//   set: (target: typeof featureFlags, prop: string, value: boolean) => {
//     if (typeof value !== 'boolean') {
//       Logger.error(
//         `Error: Feature flag '${prop}' must be set to a boolean value`
//       );
//       return false;
//     }
//     const dashedProp = prop
//       .toString()
//       .replace(/([a-z])([A-Z])/g, '$1-$2')
//       .toLowerCase();

//     if (target.has(dashedProp)) {
//       (target.get(dashedProp) as Writable<Setting>).set({
//         value,
//         updated: Math.floor(Date.now() / 1000).toString()
//       });
//       return true;
//     } else {
//       Logger.error(`Error: Feature flag '${prop}' does not exist`);
//       return false;
//     }
//   }
// };

// type FeaturesProxy = {
//   [key: string]: Readable<boolean>;
// };

// const Features = new Proxy(
//   featureFlags,
//   featuresHandler
// ) as unknown as FeaturesProxy;

// This fn alias is to please Typescript since the devs have decided to not allow
// setting different types for getters and setters, who'd ever need that!
// const setFeature = (flag: string, value: boolean) =>
//   ((Features[flag] as unknown as boolean) = value);

export default new FeaturesClass(featureFlags);
