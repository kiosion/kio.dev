import { BsFillPersonFill } from 'react-icons/bs';
import type { Rule } from 'sanity';
// import React from 'react';

// const highlightRender = (props) => (
//   <span style={{ backgroundColor: '#ccffcc' }}>{props.children}</span>
// );

export default {
  name: 'author',
  title: 'Authors',
  type: 'document',
  icon: BsFillPersonFill,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'bio',
      title: 'Bio',
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
      ],
      validation: (Rule: Rule) => Rule.required()
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
        { type: 'image' },
        { type: 'code' },
        { type: 'divider' }
      ]
    },
    {
      name: 'timeline',
      title: 'Timeline',
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
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string'
            },
            {
              name: 'range',
              title: 'Date range',
              type: 'object',
              fields: [
                {
                  name: 'start',
                  title: 'Start',
                  type: 'date',
                  options: {
                    dateFormat: 'MMMM Do, YYYY'
                  },
                  validation: (Rule: Rule) => Rule.required()
                },
                {
                  name: 'end',
                  title: 'End',
                  type: 'date',
                  options: {
                    dateFormat: 'MMMM Do, YYYY'
                  }
                }
              ]
            },
            {
              name: 'skills',
              title: 'Skills',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'tag' }]
                }
              ]
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
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
