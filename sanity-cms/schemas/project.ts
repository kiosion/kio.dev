import BaseDocument from './base-document';
import type { PreviewConfig, Rule, PreviewValue } from 'sanity';

export default {
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    ...BaseDocument.filter((field) => field.name !== 'author'),
    {
      name: 'external',
      title: 'External',
      type: 'boolean',
      description: 'Is this project hosted on an external site?',
      initialValue: false,
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Link to external project'
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' }
    },
    {
      name: 'externalAuthor',
      title: 'External Author',
      type: 'string',
      description: 'Name of external author, if applicable'
    },
    {
      name: 'image',
      title: 'Project Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'Primary programming language used in project'
    },
    {
      name: 'externalLinks',
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
