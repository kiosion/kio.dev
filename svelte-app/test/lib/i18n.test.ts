import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { t, linkTo, check, isLocalized, currentLang } from '$i18n';
import { get, readable } from 'svelte/store';
import Logger from '$lib/logger';

// TODO: Find a way to mock $app/stores per-test instead of this bs :(
// See https://github.com/vitest-dev/vitest/issues/2536
vi.mock('$app/stores', () => {
  return {
    page: {
      subscribe: (run: (value: unknown) => void) => {
        run({ path: '/', params: { lang: 'fr' } });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return (): void => {};
      }
    }
  };
});

describe('i18n', () => {
  beforeEach((ctx) => {
    currentLang.set('en');
    expect(get(currentLang)).toBe('en');
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('should translate a given key', () => {
    expect(t('Work')).toBe('Work');

    currentLang.set('fr');
    expect(get(currentLang)).toBe('fr');
    expect(t('Work')).toBe('Travail');
  });

  it('should return given key and log error when key is not found', () => {
    Logger.errorOnce = vi.fn(() => {});

    const key = 'This key does not exist!';

    expect(t(key)).toBe(key);
    expect(Logger.errorOnce).toHaveBeenCalledOnce();
    expect(Logger.errorOnce).toHaveBeenCalledWith(
      `[i18n] Missing translation for key "${key}" in en.json`
    );

    currentLang.set('fr');
    expect(get(currentLang)).toBe('fr');
    expect(t(key)).toBe(key);
    expect(Logger.errorOnce).toHaveBeenCalledWith(
      `[i18n] Missing translation for key "${key}" in fr.json`
    );
  });

  it('should transform URL to localized URL', () => {
    expect(linkTo('/')).toBe('/en/');

    currentLang.set('fr');
    expect(get(currentLang)).toBe('fr');
    expect(linkTo('/')).toBe('/fr/');
  });

  it('should transform URL to localized URL when lang is in path', () => {
    currentLang.set('fr');
    expect(linkTo('/')).toBe('/fr/');
  });
});
