import type { Handle, HandleServerError, ResolveOptions } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
  const resolveOptions: ResolveOptions = {
    filterSerializedResponseHeaders: (name: string) => name === 'content-type',
  };

  return await resolve(event, resolveOptions);
}) satisfies Handle;

export const handleError = (({ error }) => ({
  code: (error as Error & { code?: number })?.code ?? 500,
  message: (error as Error)?.message ?? 'An unknown error occured.',
  stack: (error as Error)?.stack,
})) satisfies HandleServerError;
