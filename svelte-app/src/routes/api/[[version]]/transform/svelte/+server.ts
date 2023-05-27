import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { type InternalModuleFormat, type Plugin, rollup } from 'rollup';
import svelte from 'rollup-plugin-svelte';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.text();

  if (!body) {
    return new Response(JSON.stringify({ error: 'No body provided' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const result = await bundle(body);

    if (result instanceof Error) {
      return new Response(JSON.stringify({ error: result?.message || 'Unknown error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ code: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

const virtualInput = (input: string, code: string): Plugin => {
    return {
      name: 'svelte-virtual',
      resolveId: (id: string) => (id === input ? id : null),
      load: (id: string) => {
        return id === input ? { code, moduleSideEffects: 'no-treeshake' } : null;
      },
      transform: (code: string, id: string) => {
        return id === input ? { code, moduleSideEffects: 'no-treeshake' } : null;
      }
    };
  },
  getConfig = (code: string) => ({
    input: 'virtual-entry.svelte',
    plugins: [
      virtualInput('virtual-entry.svelte', code),
      svelte({
        compilerOptions: {
          dev: false
        },
        emitCss: false
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
        extensions: ['.svelte', '.js']
      }),
      commonjs()
    ],
    output: {
      format: 'iife' as InternalModuleFormat,
      name: 'component',
      globals: {
        svelte: 'svelte'
      }
    }
  }),
  bundle = async (code: string): Promise<string | Error> => {
    try {
      const config = getConfig(code);

      return rollup(config)
        .then((rollupResult) =>
          rollupResult
            .generate(config.output)
            .then((result) => result.output[0].code)
            .catch((e: unknown) => e as Error)
        )
        .catch((e: unknown) => e as Error);
    } catch (e: unknown) {
      return e as Error;
    }
  };
