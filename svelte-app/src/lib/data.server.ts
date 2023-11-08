import { REMOTE_API_TOKEN } from '$lib/env.server';
import Logger from '$lib/logger';

export type ResponseOrError =
  | {
      code: null | undefined;
      message: never;
      detail: never;
      data: never;
    }
  | {
      code: number;
      message: string;
      detail: string;
      data: never;
    }
  | {
      code: number;
      message: never;
      detail: never;
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
      detail?: string;
      data?: undefined;
      meta?: undefined;
    }
  | {
      code?: undefined;
      error?: undefined;
      detail?: undefined;
      data: ResData['result'];
      meta: ResData['meta'] & { [key: string]: unknown };
    };

export const endpointResponse = (content: Record<string, unknown>, status = 200) => {
  return new Response(JSON.stringify(content), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    status
  });
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

  return normalized;
};

const fetchRemote = async (endpoint: string | URL): Promise<Normalized> => {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });

    const jsonResponse = (await response.json()) as ResponseOrError;

    if (response.status !== 200 || !jsonResponse?.data?.result) {
      Logger.error(`Failed to fetch from ${endpoint}: ${response.status}`);

      return {
        code: response.status,
        error: jsonResponse?.message || `Failed to fetch from ${endpoint}`,
        detail: jsonResponse?.detail || undefined
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
