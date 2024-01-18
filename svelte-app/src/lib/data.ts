import Logger from '$lib/logger';

import { error } from '@sveltejs/kit';

import type { NumericRange } from '@sveltejs/kit';

const GENERIC_ERROR_NO_DATA = 'Failed to load required data.',
  GENERIC_ERROR_SOMETHING_WENT_WRONG = 'Sorry, something went wrong. Please try again.';

const createGenericError = (message: string) => new Error(message);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Clean<T> = T extends Error ? never : T extends any[] ? CleanArray<T> : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CleanArray<T extends any[]> = {
  [P in keyof T]: Clean<T[P]>;
};

export const handleLoadError = <T>(data?: T | Error): Clean<T> => {
  if (!data) {
    throw error(500, {
      message: GENERIC_ERROR_NO_DATA,
      stack: createGenericError(GENERIC_ERROR_NO_DATA).stack
    });
  }

  if (data instanceof Error) {
    throw error((data as Error & { code?: NumericRange<400, 599> })?.code ?? 500, {
      message: data?.message || GENERIC_ERROR_SOMETHING_WENT_WRONG,
      cause: data?.cause,
      stack: data?.stack || createGenericError(GENERIC_ERROR_SOMETHING_WENT_WRONG).stack
    });
  }

  if (Array.isArray(data)) {
    const erroredData = data.filter((item) => item instanceof Error) as Error[];

    if (erroredData.length) {
      throw error(
        (erroredData[0] as Error & { code?: NumericRange<400, 599> })?.code ?? 500,
        {
          message: erroredData[0]?.message || GENERIC_ERROR_SOMETHING_WENT_WRONG,
          cause: erroredData[0]?.cause,
          stack:
            erroredData[0]?.stack ||
            createGenericError(GENERIC_ERROR_SOMETHING_WENT_WRONG).stack
        }
      );
    }
  }

  return data as Clean<T>;
};

export const fetchRepoStats = async (fetch: typeof window.fetch, githubUrl?: string) => {
  try {
    const repo = githubUrl?.split('github.com/')?.[1];

    if (!repo?.length) {
      return { stars: 0, watchers: 0 };
    }

    const res = await fetch(`https://api.github.com/repos/${repo}`),
      json = await res.json(),
      stars = (json?.stargazers_count as number | undefined) ?? 0,
      watchers = (json?.subscribers_count as number | undefined) ?? 0;

    return { stars, watchers };
  } catch (e) {
    Logger.error('Failed to fetch stars for project', e);
    return { stars: 0, watchers: 0 };
  }
};
