import { APP_THEMES } from '$lib/consts';
import { ENV } from '$lib/env';
import { isThemeChoice, THEME_COOKIE_NAME } from '$lib/theme';
import type { LayoutServerLoad } from './$types';

export const trailingSlash = 'ignore';
export const ssr = ENV !== 'testing';

export const load = (async ({ cookies }) => {
  const rawTheme = cookies.get(THEME_COOKIE_NAME);

  return {
    initialTheme: isThemeChoice(rawTheme) ? rawTheme : APP_THEMES.DARK
  };
}) satisfies LayoutServerLoad;
