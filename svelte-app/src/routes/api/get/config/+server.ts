import { GetConfigParamsSchema } from '$lib/api/schemas';
import { createEndpoint } from '$lib/api/utils.server';
import { getConfig } from '$lib/sanity.server';

export const GET = createEndpoint(GetConfigParamsSchema, getConfig);
