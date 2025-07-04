import { validateWithSchema } from '$lib/api/schemas';
import { errorResponse, isAPISuccess } from '$lib/api/types';

import { json } from '@sveltejs/kit';

import type { RequestHandler } from '@sveltejs/kit';
import type { APIResponse } from '$lib/api/types';
import type { z } from 'zod';

export function createEndpoint<TSchema extends z.ZodTypeAny, TResponse>(
  schema: TSchema,
  handler: (params: z.infer<TSchema>) => Promise<APIResponse<TResponse>>
): RequestHandler {
  return async ({ url, request }) => {
    try {
      // Parse params based on method
      const rawParams =
        request.method === 'GET'
          ? Object.fromEntries(url.searchParams)
          : await request.json();

      const params = validateWithSchema(schema, rawParams);
      if (!params.success) {
        return json(errorResponse(400, params.errors), { status: 400 });
      }
      // console.log('Parsed params:', params);
      const result = await handler(params.data);
      // console.log('Handler result:', result);

      const status = isAPISuccess(result) ? 200 : 400;
      return json(result, { status });
    } catch (err) {
      const response =
        err instanceof Error
          ? errorResponse(400, err.message)
          : errorResponse(400, 'Validation failed');
      return json(response, { status: 400 });
    }
  };
}
