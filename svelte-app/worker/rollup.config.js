import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import polyfills from 'rollup-plugin-polyfill-node';

export default {
  input: './src/worker-input.js',
  output: {
    format: 'iife',
    file: '../static/scripts/svelte-worker.js',
    name: 'SvelteWorker'
  },
  plugins: [
    polyfills(),
    resolve({
      browser: true
    }),
    json(),
    commonjs()
  ],
  onwarn: (warning, warn) => {
    if (
      warning.code === 'CIRCULAR_DEPENDENCY' ||
      warning.code === 'UNRESOLVED_IMPORT' ||
      (warning.code === 'PLUGIN_ERROR' && warning.pluginCode === 'NOT_IMPORTED')
    ) {
      return;
    }
    warn(warning);
  }
};
