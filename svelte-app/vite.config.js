import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import Inspect from 'vite-plugin-inspect';
import { defineConfig } from 'vite';
// import ClassMangler from 'vite-plugin-class-mangler';

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    sveltekit(),
    // ClassMangler.default({
    //   dev: true,
    //   length: 8
    // }),
    Inspect()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
