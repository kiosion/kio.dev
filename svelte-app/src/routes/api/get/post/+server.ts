import { GetPostParamsSchema } from '$lib/api/schemas';
import { createEndpoint } from '$lib/api/utils.server';
import { getPost } from '$lib/sanity.server';

export const GET = createEndpoint(GetPostParamsSchema, getPost);
