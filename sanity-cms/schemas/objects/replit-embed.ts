import type { Rule } from 'sanity';

export default {
  name: 'replitEmbed',
  title: 'Replit Embed',
  type: 'object',
  fields: [
    {
      name: 'url',
      title: 'Replit URL',
      type: 'url',
      validation: (Rule: Rule) => Rule.required()
    }
  ]
};
