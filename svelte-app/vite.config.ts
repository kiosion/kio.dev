import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import StripTestSelectors from 'vite-plugin-test-selectors';
import Inspect from 'vite-plugin-inspect';
import svg from '@poppanator/sveltekit-svg';
// import dotenv from 'dotenv';

// dotenv.config();
// const viteEnv = {} as Record<string, string>;
// Object.keys(process.env).forEach((key) => {
//   if (key.startsWith('VITE_')) {
//     viteEnv[`import.meta.env.${key}`] = process.env[key] as string;
//   }
// });

export default defineConfig({
  plugins: [
    svg(),
    sveltekit(),
    StripTestSelectors({
      dev: process.env.MODE !== 'testing'
    }),
    process.env.MODE === 'testing' && Inspect()
  ],
  optimizeDeps: {
    include: [
      'highlight.js',
      'highlight.js/lib/core',
      'seedrandom',
      'moment',
      '@sanity/image-url'
    ]
  },
  // resolve: {
  //   define: {
  //     ...viteEnv
  //   }
  // },
  // ssr: {
  //   noExternal: ['devalue']
  // },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  appType: 'custom'
});
