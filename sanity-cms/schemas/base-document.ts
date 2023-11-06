import Body from './objects/body';
import type { Rule } from 'sanity';

export default [
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
  {
    name: 'views',
    title: 'Views',
    type: 'number',
    initialValue: () => 0
  },
  {
    name: 'author',
    title: 'Author',
    type: 'reference',
    to: { type: 'author' }
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
];
