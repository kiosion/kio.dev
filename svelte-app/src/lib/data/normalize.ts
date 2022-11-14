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

const normalize = (data: Response) => {
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
