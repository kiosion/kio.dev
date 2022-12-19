import { browser } from '$app/environment';
import Logger from '$lib/logger';
import {
  readable,
  writable,
  get,
  type Readable,
  type Writable
} from 'svelte/store';

const defaultFlags = new Map([
  ['reduce-motion', writable(false)],
  ['sounds', writable(true)],
  ['custom-cursor', writable(false)],
  ['comic-sans', writable(false)],
  ['comments', writable(false)],
  ['tooltips', writable(false)]
]);

let featureFlags: typeof defaultFlags;

if (browser) {
  const storedFlags = localStorage.getItem('featureFlags'),
    parsed = storedFlags
      ? (JSON.parse(atob(storedFlags)) as [string, boolean][])
      : [];
  const writableFlags = new Map(
    parsed
      .filter(([key]) => defaultFlags.has(key))
      .map(([key, initialValue]) => [key, writable(initialValue)])
  );
  featureFlags = new Map([...defaultFlags, ...writableFlags]);

  featureFlags.forEach((feature) => {
    feature.subscribe((value) => {
      const flags = Array.from(featureFlags.entries()).map(([key, value]) => [
        key,
        get(value)
      ]);
      localStorage.setItem('featureFlags', btoa(JSON.stringify(flags)));
    });
  });
} else {
  featureFlags = defaultFlags;
}

const featuresHandler = {
  get: (target: typeof featureFlags, prop: string) => {
    let dashedProp = prop
      .toString()
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
    if (
      dashedProp.split('-')[0] === 'use' ||
      dashedProp.split('-')[0] === 'enable' ||
      dashedProp.split('-')[0] === 'view'
    ) {
      dashedProp = dashedProp.split('-').slice(1).join('-');
    }

    if (target.has(dashedProp)) {
      return readable<boolean>(
        get(target.get(dashedProp) as Writable<boolean>) as boolean,
        (set) => {
          const unsubscribe = (
            target.get(dashedProp) as Writable<boolean>
          ).subscribe(set);
          return () => unsubscribe();
        }
      );
    } else {
      Logger.error(`Error: Feature flag '${prop}' does not exist`);
      return readable(false);
    }
  },
  set: (target: typeof featureFlags, prop: string, value: boolean) => {
    if (typeof value !== 'boolean') {
      Logger.error(
        `Error: Feature flag '${prop}' must be set to a boolean value`
      );
      return false;
    }
    const dashedProp = prop
      .toString()
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();

    if (target.has(dashedProp)) {
      (target.get(dashedProp) as Writable<boolean>).set(value);
      return true;
    } else {
      Logger.error(`Error: Feature flag '${prop}' does not exist`);
      return false;
    }
  }
};

type FeaturesProxy = {
  [key: string]: Readable<boolean>;
};

const Features = new Proxy(
  featureFlags,
  featuresHandler
) as unknown as FeaturesProxy;

// This fn alias is to please Typescript since the devs have decided to not allow
// setting different types for getters and setters, who'd ever need that!
const setFeature = (flag: string, value: boolean) =>
  ((Features[flag] as unknown as boolean) = value);

export { Features as default, setFeature };
