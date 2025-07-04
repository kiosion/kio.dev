export type APIMeta = {
  count: number;
  total: number;
  page?: {
    current: number;
    limit: number;
    total: number;
  };
};

export type APIResponse<T> =
  | {
      status: number;
      data: T;
      meta?: APIMeta | undefined;
      errors?: string[];
    }
  | {
      status: number;
      errors: string[];
    };

export function successResponse<T>(data: T, meta?: APIMeta): APIResponse<T> {
  return {
    status: 200,
    data,
    ...(meta && { meta })
  };
}

export function errorResponse(
  status: number,
  errors: string | string[]
): APIResponse<never> {
  return {
    status,
    errors: Array.isArray(errors) ? errors : [errors]
  };
}

export const isAPISuccess = <T>(
  response: APIResponse<T>
): response is Extract<APIResponse<T>, { data: T }> =>
  'data' in response && response.data !== undefined && response.data !== null;

export const isAPIError = <T>(
  response: APIResponse<T>
): response is Extract<APIResponse<T>, { errors: string[] }> =>
  !('data' in response && response.data !== undefined && response.data !== null);
