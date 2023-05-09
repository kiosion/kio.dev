import type { PreviewConfig, PreviewValue, Rule } from 'sanity';

export default {
  name: 'header',
  title: 'Header',
  type: 'object',
  fields: [
    {
      name: 'icon',
      type: 'string',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon'
    },
    prepare: ({ title, icon }) => {
      return {
        title,
        subtitle: icon
      } as PreviewValue;
    }
  } satisfies PreviewConfig
};
