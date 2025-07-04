import { DEFAULT_FILTER_QUERY_PARAMS } from '$lib/consts';

import { z } from 'zod';

export const BaseParamsSchema = z.object({
  preview: z.coerce.boolean().default(false).optional(),
  lang: z.string().optional()
});

export const PaginationSchema = z.object({
  page: z.coerce.number().min(0).optional().default(DEFAULT_FILTER_QUERY_PARAMS.page),
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(DEFAULT_FILTER_QUERY_PARAMS.limit)
});

export const SlugOrIdSchema = z.union([
  z.object({ slug: z.string().min(1), id: z.undefined() }),
  z.object({ slug: z.undefined(), id: z.string().min(1) })
]);

export const GetConfigParamsSchema = BaseParamsSchema;

export const GetPostParamsSchema = z.intersection(SlugOrIdSchema, BaseParamsSchema);

export const GetPostsParamsSchema = z.intersection(BaseParamsSchema, PaginationSchema);

export const MutateRequestSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('inc'),
    id: z.string().min(1),
    field: z.literal('views')
  })
]);

export type GetConfigParams = z.infer<typeof GetConfigParamsSchema>;
export type GetPostParams = z.infer<typeof GetPostParamsSchema>;
export type GetPostsParams = z.infer<typeof GetPostsParamsSchema>;
export type MutateRequest = z.infer<typeof MutateRequestSchema>;

export const validateWithSchema = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  context?: string
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map((e) => {
    const path = e.path.length > 0 ? e.path.join('.') : 'root';
    const contextStr = context ? `[${context}] ` : '';
    return `${contextStr}${path}: ${e.message}`;
  });

  return { success: false, errors };
};
