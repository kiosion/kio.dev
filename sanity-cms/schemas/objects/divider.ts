export default {
  name: 'divider',
  title: 'Divider',
  type: 'object',
  fields: [
    {
      name: 'style',
      type: 'string',
      options: {
        list: [
          { title: 'break', value: 'break' },
          { title: 'readMore', value: 'readMore' },
          { title: 'divider', value: 'divider' }
        ]
      }
    }
  ]
};
