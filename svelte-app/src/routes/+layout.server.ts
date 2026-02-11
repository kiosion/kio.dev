import {APP_THEMES, WAKATIME_API_URL, WAKATIME_USER} from '$lib/consts';
import { ENV } from '$lib/env';
import { WAKATIME_API_KEY } from '$lib/env.server';
import { isThemeChoice, THEME_COOKIE_NAME } from '$lib/theme';
import type { WakaTimeStatsResponse } from '$types/wakatime';

import type { LayoutServerLoad } from './$types';

export const trailingSlash = 'ignore';
export const ssr = ENV !== 'testing';

export const load = (({ cookies, fetch }) => {
  const rawTheme = cookies.get(THEME_COOKIE_NAME);

  const wakatimeStats = fetch(
    `${WAKATIME_API_URL}/users/${WAKATIME_USER}/stats/last_year?timeout=2000`,
    {
      headers: {
        Authorization: `Bearer ${WAKATIME_API_KEY}`,
      },
    },
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json() as Promise<WakaTimeStatsResponse>;
    })
    .catch((e) => {
      console.error('Failed to fetch WakaTime stats:', e);
      throw e;
    });

  return {
    initialTheme: isThemeChoice(rawTheme) ? rawTheme : APP_THEMES.DARK,
    wakatimeStats,
  };
}) satisfies LayoutServerLoad;
