import type { Rule } from 'sanity';
// import React from 'react';

// const highlightRender = (props) => (
//   <span style={{ backgroundColor: '#ccffcc' }}>{props.children}</span>
// );

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
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'MMMM Do, YYYY'
      },
      initialValue: () => new Date()
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Code', value: 'code' },
              {
                title: 'Highlight',
                value: 'highlight'
                // blockEditor: {
                //   icon: () => 'H',
                //   render: highlightRender
                // }
              }
            ]
          }
        },
        {
          type: 'image',
          options: {
            hotspot: true
          }
        },
        { type: 'code' },
        { type: 'divider' }
      ]
    },
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
  ]
};
