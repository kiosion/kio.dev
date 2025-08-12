import Body, { BodyBlocks } from '$objects/body';

import type { PreviewConfig, PreviewValue, Rule } from 'sanity';

const Section = {
  title: 'Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: BodyBlocks
    }
  ]
};

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {
      name: 'sidebar',
      title: 'Sidebar'
    },
    {
      name: 'sections',
      title: 'Sections'
    }
  ],
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule: Rule) => Rule.required(),
      group: 'sidebar'
    },
    {
      name: 'role',
      type: 'string',
      title: 'Role',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'hero',
      type: 'string',
      title: 'Hero',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'image',
      type: 'object',
      title: 'Profile Picture',
      validation: (Rule: Rule) => Rule.required(),
      fields: [
        {
          name: 'dark',
          type: 'image',
          title: 'Dark Mode',
          validation: (Rule: Rule) => Rule.required()
        },
        {
          name: 'light',
          type: 'image',
          title: 'Light Mode',
          validation: (Rule: Rule) => Rule.required()
        }
      ],
      group: 'sidebar'
    },
    {
      name: 'handle',
      type: 'string',
      title: 'Handle',
      group: 'sidebar'
    },
    {
      name: 'bio',
      type: 'text',
      title: 'Bio',
      group: 'sidebar'
    },
    {
      name: 'enableToru',
      type: 'boolean',
      title: 'Enable Toru',
      group: 'sidebar',
      initialValue: false,
      validation: (Rule: Rule) => Rule.required()
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
            },
            {
              name: 'internal',
              title: 'Internal',
              type: 'boolean',
              initialValue: false,
              options: {
                layout: 'checkbox'
              },
              description: 'Relative to the site root, e.g. /about'
            },
            {
              name: 'rel',
              title: 'Rel',
              type: 'array',
              of: [
                {
                  type: 'string',
                  options: {
                    list: [
                      { title: 'nofollow', value: 'nofollow' },
                      { title: 'noopener', value: 'noopener' },
                      { title: 'noreferrer', value: 'noreferrer' },
                      { title: 'me', value: 'me' }
                    ]
                  }
                }
              ]
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
      ],
      group: 'sidebar'
    },
    {
      name: 'about',
      type: 'array',
      title: 'About Sections',
      group: 'sections',
      of: [Section]
    },
    {
      name: 'meta',
      type: 'array',
      title: 'Meta Sections',
      group: 'sections',
      of: [Section]
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
      title: 'PGP Key'
    }
  ]
};
