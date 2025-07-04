import { GetPostsParamsSchema } from '$lib/api/schemas';
import { createEndpoint } from '$lib/api/utils.server';
import { getPosts } from '$lib/sanity.server';

export const GET = createEndpoint(GetPostsParamsSchema, getPosts);
