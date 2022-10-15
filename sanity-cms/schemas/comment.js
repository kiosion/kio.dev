export default {
  name: 'comment',
  title: 'Comments',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Display Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'body',
      title: 'Comment',
      type: 'text',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: 'Comments will not be visible until approved',
      initialValue: false,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'verified',
      title: 'Verified',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'document',
      title: 'Post / Project',
      type: 'reference',
      // We need these to be weakrefs so referenced docs aren't
      // blocked from deletion / unpublishing
      to: [
        {
          type: 'post',
          weak: true
        },
        {
          type: 'project',
          weak: true
        }
      ],
      validation: (Rule) => Rule.required()
    }
  ],
  preview: {
    select: {
      name: 'name',
      body: 'body',
      post: 'post.title'
    },
    prepare({ name, body, post }) {
      return {
        title: `${name} on ${post}`,
        subtitle: body
      };
    }
  }
};
