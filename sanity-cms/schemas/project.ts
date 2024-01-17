import BaseDocument from '$schema/base-document';
import type { PreviewConfig, Rule, PreviewValue } from 'sanity';

export default {
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    ...BaseDocument,
    {
      name: 'images',
      title: 'Project Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ],
      validation: (Rule: Rule) => Rule.max(4)
    },
    {
      name: 'github',
      title: 'Github Link',
      type: 'url',
      description: 'Github repository link'
    },
    {
      name: 'links',
      title: 'External Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: Rule) => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule: Rule) => Rule.required()
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      subtitle: 'desc'
    },
    prepare: ({ title, date, subtitle }) => {
      return {
        title,
        subtitle: `${
          date
            ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium' }).format(
                new Date(date)
              )
            : ''
        }${date && subtitle ? ' - ' : ''}${subtitle ? subtitle : ''}`
      } as PreviewValue;
    }
  } satisfies PreviewConfig
};
