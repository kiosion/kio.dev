import Body, { BodyBlocks } from '$objects/body';

import type { PreviewConfig, PreviewValue, Rule } from 'sanity';

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {
      name: 'home',
      title: 'Homepage'
    },
    {
      name: 'about',
      title: 'About'
    },
    {
      name: 'contact',
      title: 'Contact / Footer'
    }
  ],
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'hero',
      type: 'text',
      title: 'Hero',
      validation: (Rule: Rule) => Rule.required(),
      group: 'home'
    },
    {
      name: 'info',
      type: 'array',
      title: 'Info',
      of: BodyBlocks,
      group: 'home'
    },
    {
      name: 'bio',
      type: 'text',
      title: 'Bio',
      group: 'home'
    },
    {
      name: 'about',
      title: 'About',
      type: 'array',
      of: BodyBlocks,
      group: 'about',
      validation: (Rule: Rule) => Rule.required().min(1)
    },
    {
      name: 'contact',
      title: 'Contact',
      type: 'array',
      of: BodyBlocks,
      group: 'contact',
      validation: (Rule: Rule) => Rule.required().min(1)
    },
    {
      name: 'socialLinks',
      type: 'array',
      title: 'Social Links',
      of: [
        {
          title: 'Social',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule: Rule) => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (Rule: Rule) => {
                return Rule.uri({
                  allowRelative: true,
                  scheme: ['https', 'http', 'mailto', 'tel']
                });
              }
            }
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'url'
            },
            prepare: ({ title, subtitle }) =>
              ({
                title,
                subtitle
              }) as PreviewValue
          } satisfies PreviewConfig
        }
      ]
    },
    {
      name: 'timeline',
      title: 'Work Timeline',
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
            Body
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
              start: 'range.start',
              end: 'range.end'
            },
            prepare: ({ title, subtitle, start, end }) =>
              ({
                title,
                subtitle: `${start ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium' }).format(new Date(start)) : ''}${start ? ' to ' : ''}${end ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium' }).format(new Date(end)) : 'now'}${subtitle ? ' - ' : ''}${subtitle ? subtitle : ''}`
              }) as PreviewValue
          } satisfies PreviewConfig
        }
      ]
    },
    {
      name: 'pgpKey',
      type: 'text',
      title: 'PGP Key',
      group: 'contact'
    }
  ]
};
