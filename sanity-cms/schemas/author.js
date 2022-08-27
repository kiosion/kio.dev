import { BsFillPersonFill } from 'react-icons/bs';
import React from 'react';

const highlightRender = (props) => (
  <span style={{ backgroundColor: '#ccffcc' }}>{props.children}</span>
);

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
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
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
                value: 'highlight',
                blockEditor: {
                  icon: () => 'H',
                  render: highlightRender
                }
              }
            ]
          }
        },
        { type: 'image' },
        { type: 'code' },
        { type: 'divider' }
      ],
      validation: (Rule) => Rule.required()
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
                value: 'highlight',
                blockEditor: {
                  icon: () => 'H',
                  render: highlightRender
                }
              }
            ]
          }
        },
        { type: 'image' },
        { type: 'code' },
        { type: 'divider' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    }
  }
};
