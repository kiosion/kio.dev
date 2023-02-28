import type { Rule } from '@sanity/types';

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
    prepare({ title, icon }: { title: string; icon: string }) {
      return {
        title,
        subtitle: icon,
        media: ''
      };
    }
  }
};
