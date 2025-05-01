import Logger from '$lib/logger';

import type { Result } from '$lib/api/result';
import type { HeadingNode } from '$types/documents';

export const endpointResponse = <T extends Record<PropertyKey, unknown>>(
  content: T,
  status = 200,
  init: ResponseInit = {}
) => {
  return new Response(JSON.stringify(content), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    status,
    ...init
  });
};

type MaybeBlock = {
  _type?: unknown;
  _key?: unknown;
  style?: unknown;
  children?: unknown;
};

type RawChild = {
  text?: unknown;
};

type HeadingBlock = {
  _type: 'block';
  _key: string;
  style: `h${1 | 2 | 3 | 4 | 5 | 6}`;
  children: RawChild[];
};

export const buildSummary = (body?: unknown): Result<HeadingNode[]> => {
  try {
    if (!Array.isArray(body)) {
      return [[], undefined];
    }

    const headingBlocks = body.filter(isHeadingBlock);

    if (headingBlocks.length === 0) {
      return [[], undefined];
    }

    const headings = headingBlocks.map(blockToHeading);

    const tree: HeadingNode[] = [];
    const stack: HeadingNode[] = [];

    for (const heading of headings) {
      /* unwind to the correct depth */
      while (stack.length && stack[stack.length - 1].typeLevel >= heading.typeLevel) {
        stack.pop();
      }

      if (stack.length === 0) {
        tree.push(heading);
      } else {
        const parent = stack[stack.length - 1];
        parent.children ??= [];
        parent.children.push(heading);
        heading.parent = parent.key;
      }

      stack.push(heading);
    }

    return [tree, undefined];
  } catch (e) {
    const err =
      e instanceof Error ? e : new Error('Unknown error while building summary');
    Logger.error('Error building heading summary', err);
    return [undefined, err];
  }
};

const isHeadingBlock = (b: unknown): b is MaybeBlock & HeadingBlock => {
  if (!b || typeof b !== 'object') {
    return false;
  }
  const blk = b as MaybeBlock;

  if (blk._type !== 'block') {
    return false;
  }
  if (typeof blk._key !== 'string') {
    return false;
  }
  if (typeof blk.style !== 'string') {
    return false;
  }
  if (!/^h[1-6]$/.test(blk.style)) {
    return false;
  }
  if (!Array.isArray(blk.children)) {
    return false;
  }

  return true;
};

const blockToHeading = (b: HeadingBlock): HeadingNode => ({
  text: b.children.map((c) => (typeof c.text === 'string' ? c.text : '')).join(''),
  key: b._key,
  type: b.style,
  typeLevel: Number((b.style as string)[1]) as 1 | 2 | 3 | 4 | 5 | 6,
  children: [],
  parent: null
});

// export const buildSummary = (blocks: NonNullable<(Post | Project)['body']>): Result<HeadingNode[]> => {
//   try {
//     const headings = blocks
//     .filter((block) => block._type === 'block' && block.style?.match(/^h[1-6]$/))
//     .map(blockToHeading);

//     const tree: HeadingNode[] = [];
//     const stack: HeadingNode[] = [];

//     for (const heading of headings) {
//       while (stack.length && stack[stack.length - 1].typeLevel >= heading.typeLevel) {}
//     }
//   }
// };

// type PostOrProjectBlocks = NonNullable<(Post | Project)['body']>;

// type FilteredBlock = PostOrProjectBlocks[number] & {
//   _type: 'block';
//   style: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
//   children: NonNullable<PostOrProjectBlocks[number]['children']>
// }

// const blockToHeading = (block: NonNullable<(Post | Project)['body']>[number]): HeadingNode => {
//   if (block._type !== 'block' || !block?.children?.length || !block?.style || !block.style?.match(/^h[1-6]$/)) {
//     Logger.error('Invalid block type or style', block);
//     // throw new Error('Invalid block type or style');
//   }

//   const text = block.children.map((c) => c.text).join('');
//   const lvl = Number(block.style[1]);

//   return {
//     text,
//     key: block._key,
//     type: block.style,
//     typeLevel: lvl,
//     children: [],
//     parent: null
//   };
// };
