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
    prepare({ code }: { code: { filename: string; code: string } }) {
      return {
        title: code?.filename + '.svelte' || 'unnamed.svelte',
        subtitle: 'Svelte Embed',
        media: ''
      };
    }
  }
};
