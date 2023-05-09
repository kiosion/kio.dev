import { PreviewConfig, PreviewValue } from 'sanity';
import Code from '../fields/code';

export default {
  name: 'svelteEmbed',
  title: 'Svelte Embed',
  type: 'object',
  fields: [Code({ defaultLang: 'svelte', languageAlts: ['svelte'] })],
  preview: {
    select: {
      code: 'code'
    },
    prepare: ({ code }) => {
      return {
        title: code?.filename + '.svelte' || 'unnamed.svelte',
        subtitle: 'Svelte Embed'
      } as PreviewValue;
    }
  } satisfies PreviewConfig
};
