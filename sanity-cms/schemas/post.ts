import BaseDocument from '$schema/base-document';
import type { PreviewConfig, PreviewValue } from 'sanity';

export default {
  name: 'post',
  title: 'Blog Posts',
  type: 'document',
  fields: BaseDocument,
  preview: {
    select: {
      title: 'title',
      date: 'date',
      subtitle: 'desc'
    },
    prepare: ({ title, date, subtitle }) => {
      return {
        title,
        subtitle: `${
          date
            ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium' }).format(
                new Date(date)
              )
            : ''
        }${date && subtitle ? ' - ' : ''}${subtitle ? subtitle : ''}`
      } as PreviewValue;
    }
  } satisfies PreviewConfig
};
