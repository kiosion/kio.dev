import HightlightRenderer from '../renderers/highlight';
import FootnoteRenderer from '../renderers/footnote';
import LinkRenderer from '../renderers/link';
import Code from '../fields/code';

import { BsLink45Deg } from 'react-icons/bs';
import { BiHighlight, BiNote } from 'react-icons/bi';

export const CustomMarks = {
  decorators: [
    { title: 'Strong', value: 'strong' },
    { title: 'Emphasis', value: 'em' },
    { title: 'Underline', value: 'underline' },
    { title: 'Strikethrough', value: 'strike-through' },
    { title: 'Code', value: 'code' },
    {
      title: 'Highlight',
      value: 'highlight',
      icon: BiHighlight,
      component: HightlightRenderer
    }
  ],
  annotations: [
    {
      name: 'link',
      type: 'object',
      title: 'Link',
      fields: [
        {
          name: 'href',
          type: 'string',
          title: 'URL'
        },
        {
          title: 'Open in new tab',
          name: 'newtab',
          type: 'boolean',
          initialValue: true
        },
        {
          title: 'External',
          name: 'external',
          type: 'boolean',
          initialValue: true
        }
      ],
      icon: BsLink45Deg,
      component: LinkRenderer
    }
  ]
};

export const BodyBlocks = [
  {
    type: 'block',
    marks: {
      decorators: CustomMarks.decorators,
      annotations: [
        ...CustomMarks.annotations,
        {
          name: 'footnote',
          type: 'object',
          title: 'Footnote',
          fields: [
            {
              name: 'note',
              type: 'array',
              title: 'Note',
              of: [
                {
                  type: 'block',
                  styles: [{ title: 'Normal', value: 'normal' }],
                  marks: {
                    decorators: CustomMarks.decorators,
                    annotations: CustomMarks.annotations
                  }
                }
              ]
            }
          ],
          icon: BiNote,
          component: FootnoteRenderer
        }
      ]
    }
  },
  {
    type: 'image',
    options: {
      hotspot: true
    }
  },
  Code(),
  { type: 'divider' },
  { type: 'header' },
  { type: 'replitEmbed' },
  { type: 'svelteEmbed' }
];

export default {
  name: 'body',
  title: 'Body',
  type: 'array',
  of: BodyBlocks
};
