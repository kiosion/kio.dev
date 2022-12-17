import HightlightRenderer from '../renderers/highlight';
import FootnoteRenderer from '../renderers/footnote';
import LinkRenderer from '../renderers/link';

import { BsLink45Deg } from 'react-icons/bs';
import { BiHighlight, BiNote } from 'react-icons/bi';

import { CodeBlockExtensionOpts } from '../utils/code';

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
      blockEditor: {
        icon: BiHighlight,
        render: HightlightRenderer
      }
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
      blockEditor: {
        icon: BsLink45Deg,
        render: LinkRenderer
      }
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
          blockEditor: {
            icon: BiNote,
            render: FootnoteRenderer
          }
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
  { type: 'code', options: CodeBlockExtensionOpts },
  { type: 'divider' }
];

export default {
  name: 'body',
  title: 'Body',
  type: 'array',
  of: BodyBlocks
};
