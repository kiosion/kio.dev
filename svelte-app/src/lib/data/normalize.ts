import { ENV } from '$lib/env';

/**
 * Util to serialize recieved API data to common types
 */

interface Response extends Record<string, unknown> {
  code: number;
  message?: string;
  data?: ResData;
}

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

interface Normalized extends Record<string, unknown> {
  code?: number;
  error?: string;
  data?: ResData['result'];
  meta?: ResData['meta'] & { [key: string]: unknown };
}

const normalize = (data: Response | Record<string, unknown>) => {
  if (!data?.code || (!data?.message && !data?.data)) {
    return {
      code: 500,
      error:
        'Endpoint error: Failed to normalize data. Remote API returned invalid data.'
    };
  }

  const normalized = {} as Normalized;

  if (data.message) {
    normalized.code = (data as Response).code;
    normalized.error = (data as Response).message;
    return normalized;
  }

  const { data: resData } = data as Response;

  normalized.data = resData?.result;
  normalized.meta = {} as Normalized['meta'];
  resData?.meta && (normalized.meta = { ...resData.meta });

  Object.keys(resData as ResData).forEach((key) => {
    if (!['result', 'meta'].includes(key)) {
      (normalized.meta as ResData['meta'] & { [key: string]: unknown })[key] = (
        resData as ResData
      )[key];
    }
  });

  !['development', 'backed', 'test'].includes(ENV) &&
    normalized.meta?.query &&
    delete normalized.meta.query;

  return normalized;
};

export default normalize;
