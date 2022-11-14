import { browser } from '$app/environment';
import Logger from '$lib/logger';
import { writable, get, type Writable } from 'svelte/store';

const defaultFlags = new Map([
  ['reduce-motion', writable(false)],
  ['sounds', writable(true)],
  ['custom-cursor', writable(true)],
  ['comic-sans', writable(false)]
]);

class FeaturesClass {
  flags: Writable<Map<string, Writable<boolean>>>;
  permissions: number;

  constructor(initialFlags: Map<string, Writable<boolean>>) {
    this.flags = writable<Map<string, Writable<boolean>>>(
      new Map([...initialFlags])
    );
    this.permissions = 0o5;

    this.flags.subscribe((flags) => {
      flags.forEach((flag) => {
        flag.subscribe(() => {
          if (browser) {
            const flagsArr: [string, boolean][] = Array.from(
              flags.entries()
            ).map(([key, value]) => [key, Boolean(get(value))]);
            const encoded = btoa(JSON.stringify(flagsArr));
            localStorage.setItem('featureFlags', encoded);
          }
        });
      });
    });
  }

  can = (flag: string): Writable<boolean> => {
    const flagName = flag.replace('use ', '').replace(' feature', ''),
      dashedFlagName =
        flagName.split(' ').length > 1
          ? flagName.split(' ').join('-')
          : flagName;

    return (
      (get(this.flags).has(dashedFlagName) &&
        get(this.flags).get(dashedFlagName)) ||
      writable(false)
    );
  };

  set = (flag: string, value: boolean): Writable<boolean> | undefined => {
    const doesExist = get(this.flags).has(flag);
    if (!doesExist) {
      Logger.error(
        `Error: Feature flag '${flag}' does not exist`,
        'stores/features'
      );
    }
    get(this.flags).get(flag)?.set(value);
    return get(this.flags).get(flag);
  };
}

const Features = new FeaturesClass(
  (() => {
    if (!browser) {
      return new Map([...defaultFlags]);
    }
    const storedFlags = localStorage.getItem('featureFlags'),
      parsed = storedFlags
        ? (JSON.parse(atob(storedFlags)) as [string, boolean][])
        : [];
    const writableFlags = new Map(
      parsed
        .filter(([key]) => defaultFlags.has(key))
        .map(([key, value]) => [key, writable(value)])
    );
    return new Map([...defaultFlags, ...writableFlags]);
  })()
);

export default Features;
