import { browser } from '$app/environment';
import { APP_THEMES } from '$lib/consts';

export type ThemeChoice = (typeof APP_THEMES)[keyof typeof APP_THEMES];

export const THEME_COOKIE_NAME = 'theme-preference';

export const isThemeChoice = (v: unknown): v is ThemeChoice => {
  return v === APP_THEMES.LIGHT || v === APP_THEMES.DARK;
};

export const readThemeCookie = (): ThemeChoice | null => {
  if (!browser) {
    return null;
  }

  const raw = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${THEME_COOKIE_NAME}=`))
    ?.split('=')[1];

  if (!raw) {
    return null;
  }
  const decoded = decodeURIComponent(raw);
  return isThemeChoice(decoded) ? decoded : null;
};

export const writeThemeCookie = (choice: ThemeChoice) => {
  // lax same-site, 1 year expiry
  document.cookie = `${THEME_COOKIE_NAME}=${encodeURIComponent(choice)}; Path=/; SameSite=Lax; Max-Age=31536000`;
};
