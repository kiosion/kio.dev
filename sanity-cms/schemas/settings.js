export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', /* 'delete', */ 'publish'],
  groups: [
    {
      name: 'pages',
      title: 'Pages'
    },
    {
      name: 'experiments',
      title: 'Experiments'
    },
    {
      name: 'links',
      title: 'Links'
    },
    {
      name: 'pinned',
      title: 'Pinned'
    },
    {
      name: 'comments',
      title: 'Comments'
    }
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Site title'
    },
    {
      name: 'indexHeading',
      type: 'string',
      title: 'Index heading',
      group: 'pages'
    },
    {
      name: 'indexSubheading',
      type: 'string',
      title: 'Index subheading',
      group: 'pages'
    },
    {
      name: 'me',
      title: 'Me',
      type: 'reference',
      to: {
        type: 'author'
      }
    },
    {
      name: 'socialLinks',
      type: 'array',
      title: 'Social Links',
      group: 'links',
      of: [
        {
          title: 'Social',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (Rule) =>
                Rule.regex(/^\/.*|^https?:\/\/.*/).required()
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
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'iconSize',
              title: 'Icon Size',
              type: 'number',
              initialValue: 20,
              validation: (Rule) => Rule.min(10).max(30).required(),
              description: 'Size adjustment in pixels'
            },
            {
              name: 'iconRotation',
              title: 'Icon Rotation',
              type: 'number',
              initialValue: 0,
              description: 'Rotation in degrees',
              validation: (Rule) => Rule.min(0).max(360).required()
            }
          ]
        }
      ]
    },
    {
      name: 'pgpKey',
      type: 'text',
      title: 'PGP Key',
      group: 'pages'
    },
    {
      name: 'pinnedPost',
      type: 'reference',
      title: 'Pinned Post',
      group: 'pinned',
      to: {
        type: 'post'
      }
    },
    {
      name: 'pinnedProject',
      type: 'reference',
      title: 'Pinned Project',
      group: 'pinned',
      to: {
        type: 'project'
      }
    },
    {
      name: 'commentsEnabled',
      type: 'boolean',
      title: 'Comments Enabled',
      group: 'comments',
      initialValue: true,
      description: 'Enable or disable new comments on all posts'
    },
    {
      name: 'commentsRequireApproval',
      type: 'boolean',
      title: 'Comments Require Approval',
      group: 'comments',
      initialValue: true,
      description: 'Require new comments to be approved before they are visible'
    },
    {
      name: 'commentsRequireAuth',
      type: 'boolean',
      title: 'Comments Require Auth',
      group: 'comments',
      initialValue: false,
      description: 'Require users to be logged in to comment'
    },
    {
      name: 'commentsVisible',
      type: 'boolean',
      title: 'Comments Visible',
      group: 'comments',
      initialValue: true,
      description: 'Show comments on posts'
    }
  ]
};
