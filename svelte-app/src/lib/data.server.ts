import { ENV } from '$lib/env';
import { REMOTE_API_TOKEN } from '$lib/env.server';
import Logger from '$lib/logger';

export type ResponseOrError =
  | {
      code: null | undefined;
      message: never;
      data: never;
    }
  | {
      code: number;
      message: string;
      data: never;
    }
  | {
      code: number;
      message: never;
      data: ResData;
    };

interface ResData extends Record<string, unknown> {
  result: Record<string, unknown>;
  ms?: number;
  query?: string;
  meta?: {
    total?: number;
    count?: number;
    id?: string;
    type?: string;
  };
}

type Normalized =
  | {
      code: number;
      error: string;
      data?: undefined;
      meta?: undefined;
    }
  | {
      code?: undefined;
      error?: undefined;
      data: ResData['result'];
      meta: ResData['meta'] & { [key: string]: unknown };
    };

/**
 * Util to serialize recieved API data to common types
 */
const normalize = (data: ResponseOrError) => {
  if (!data?.code || (!data?.message && !data?.data)) {
    throw new Error('Failed to normalize data: Invalid or undefined data recieved');
  }

  const normalized = {} as Normalized;

  if (data.message) {
    normalized.code = data.code;
    normalized.error = data.message;
    return normalized;
  }

  const { data: resData } = data;

  normalized.data = resData?.result;
  normalized.meta = {} as Normalized['meta'];
  resData?.meta && (normalized.meta = { ...resData.meta });

  const keys = Object.keys(resData);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (['result', 'meta'].includes(key)) {
      continue;
    }
    (normalized.meta as ResData['meta'] & { [key: string]: unknown })[key] = resData[key];
  }

  !['development', 'backed', 'test'].includes(ENV) &&
    normalized.meta?.query &&
    (normalized.meta.query = undefined);

  return normalized;
};

const fetchRemote = async ({
  endpoint,
  options
}: {
  endpoint: string | URL;
  options?: RequestInit;
}): Promise<Normalized> => {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      },
      ...options
    });

    const jsonResponse = (await response.json()) as ResponseOrError;

    if (response.status !== 200 || !jsonResponse?.data?.result) {
      Logger.error(`Failed to fetch from ${endpoint}: ${response.status}`);

      return {
        code: response.status,
        error: jsonResponse?.message || `Failed to fetch from ${endpoint}`
      };
    }

    const normalizedResponse = normalize(jsonResponse);

    return normalizedResponse;
  } catch (err: unknown) {
    Logger.error(`Failed to fetch from ${endpoint}: Unknown error occured`, {
      err
    });
    return {
      code: 500,
      error: `Unknown or unhandled error occured: ${err}`
    };
  }
};

export { fetchRemote, normalize };
