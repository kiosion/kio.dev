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
