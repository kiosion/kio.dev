import type { Rule } from 'sanity';
import Body from '$objects/body';

export default {
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 1,
      description: 'Page title',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'desc',
      title: 'Description',
      type: 'text',
      rows: 1,
      description: 'SEO description',
      validation: (Rule: Rule) => Rule.max(160)
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      description: 'Main heading on the page',
      validation: (Rule: Rule) => Rule.required()
    },
    Body
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'heading'
    }
  }
};
