import NetlifyAdapter from '@sveltejs/adapter-netlify';
import NodeAdapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import path from 'path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import { codeToHtml } from 'shiki';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-restricted-imports
import remarkFootnotes from './scripts/remark-footnotes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.md'],
  compilerOptions: {
    cssHash: ({ hash, css }) => `sc-${hash(css)}`,
    discloseVersion: false,
  },
  preprocess: [
    mdsvex({
      extensions: ['.md'],
      smartypants: {
        backticks: false,
      },
      layout: {
        post: path.resolve(__dirname, 'src/components/markdown-post.svelte'),
      },
      highlight: {
        highlighter: async (code, lang) => {
          const html = await codeToHtml(code, {
            lang: lang ?? 'text',
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false,
            colorReplacements: {
              'github-light': {
                '#fff': '#e4e0dc',
              },
              'github-dark': {
                '#24292e': '#2a2726',
              },
            },
          });
          return `{@html \`${escapeSvelte(html)}\`}`;
        },
      },
      remarkPlugins: [remarkFootnotes],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: { class: 'heading-anchor' },
          },
        ],
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['nofollow', 'noopener', 'noreferrer'],
          },
        ],
      ],
    }),
    vitePreprocess({
      // Seems to break snippet exports from modules >= 5.5.0
      // script: true,
      style: {
        resolve: {
          alias: [
            {
              find: /^@styles\/(.*)$/,
              replacement: path.resolve(__dirname, 'src/styles/$1.scss'),
            },
          ],
        },
      },
    }),
  ],
  kit: {
    alias: {
      '@breakpoints': 'src/styles/breakpoints',
      '@colours': 'src/styles/colours',
      '@utils': 'src/styles/utils',
      '@vars': 'src/styles/vars',
      $assets: 'src/static',
      $components: 'src/components',
      $content: 'src/content',
      $langs: 'src/languages',
      $routes: 'src/routes',
      $tests: 'tests',
      $types: 'types/app',
    },
    adapter:
      process.env.SVELTE_ADAPTER_ENV === 'netlify'
        ? NetlifyAdapter({
            edge: false,
            split: false,
          })
        : NodeAdapter({ out: './dist' }),
    files: {
      lib: 'src/lib',
      params: 'src/params',
      routes: 'src/routes',
    },
    prerender: {
      crawl: true,
      entries: ['*'],
      handleUnseenRoutes: 'ignore',
    },
  },
};
