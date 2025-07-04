import { MutateRequestSchema } from '$lib/api/schemas';
import { errorResponse, successResponse } from '$lib/api/types';
import { createEndpoint } from '$lib/api/utils.server';
import { incViews } from '$lib/sanity.server';

export const POST = createEndpoint(MutateRequestSchema, async (params) => {
  const { action, id } = params;
  if (action === 'inc') {
    const res = await incViews({ id });
    return successResponse(res);
  } else {
    return errorResponse(400, ['Invalid action']);
  }
});
