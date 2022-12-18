import Body, { BodyBlocks } from './objects/body';
import { BsFillPersonFill } from 'react-icons/bs';
import type { Rule } from 'sanity';

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
      of: BodyBlocks,
      validation: (Rule: Rule) => Rule.required()
    },
    Body,
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
                  },
                  validation: (Rule: Rule) =>
                    Rule.min(Rule.valueOfField('start')).error(
                      'End date must be after start date'
                    )
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
            Body
          ]
        }
      ]
    }
  ]
};
