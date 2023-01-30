import type { Rule } from 'sanity';

export default {
  name: 'comment',
  title: 'Comments',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Display Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'username',
      title: 'Username',
      type: 'string',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'body',
      title: 'Comment',
      type: 'text',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'document',
      title: 'On',
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
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'parent',
      title: 'Parent',
      type: 'reference',
      to: [
        {
          type: 'comment',
          weak: true
        }
      ]
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: 'Comments will not be visible until approved',
      initialValue: false,
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'verified',
      title: 'Verified',
      type: 'boolean',
      initialValue: false,
      validation: (Rule: Rule) => Rule.required()
    }
  ],
  preview: {
    select: {
      name: 'name',
      body: 'body',
      email: 'email'
    },
    prepare({
      name,
      email,
      body
    }: {
      name: string;
      email: string;
      body: string;
    }) {
      return {
        title: `${name} (${email})`,
        subtitle: body
      };
    }
  }
};
