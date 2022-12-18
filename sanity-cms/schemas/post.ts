import Body from './objects/body';
import type { Rule } from 'sanity';

export default {
  name: 'post',
  title: 'Blog Posts',
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' }
    },
    {
      name: 'himage',
      title: 'Header Image',
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
        title: title,
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
