import { rollup } from 'rollup';
import * as svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

function virtualInput(input, code) {
  return {
    name: 'svelte-virtual',
    resolveId: (id) => (id === input ? id : null),
    load: (id) => {
      return id === input ? { code, moduleSideEffects: 'no-treeshake' } : null;
    },
    transform: (code, id) => {
      return id === input ? { code, moduleSideEffects: 'no-treeshake' } : null;
    }
  };
}

function getConfig(code) {
  return {
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
      format: 'iife',
      name: 'component',
      globals: {
        svelte: 'svelte'
      }
    }
  };
}

self.addEventListener('message', function (event) {
  const { id, code } = event.data,
    config = getConfig(code);
  rollup(config).then((rollupResult) => {
    rollupResult.generate(config.output).then((result) => {
      self.postMessage({ id, result: result.output[0].code });
    });
  });
});
