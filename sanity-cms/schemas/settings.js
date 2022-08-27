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
              name: 'title',
              title: 'Title',
              type: 'string'
            },
            {
              name: 'link',
              title: 'Link',
              type: 'url'
            },
            {
              name: 'internal',
              title: 'Internal link?',
              type: 'boolean',
              initialValue: false
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
    }
  ]
};
