import Body from './objects/body';
import type { Rule } from 'sanity';

export default {
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: Rule) => Rule.required()
    },
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
      name: 'desc',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'Primary programming language used in project'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'MMMM Do, YYYY'
      },
      initialValue: () => new Date()
    },
    Body,
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }]
        }
      ]
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
    prepare({
      title,
      date,
      subtitle
    }: {
      title: string;
      date: string;
      subtitle: string;
    }) {
      return {
        title,
        subtitle: `${
          date
            ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium' }).format(
                new Date(date)
              )
            : ''
        }${date && subtitle ? ' - ' : ''}${subtitle ? subtitle : ''}`
      };
    }
  }
};
