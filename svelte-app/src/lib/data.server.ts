import Logger from '$lib/logger';

import type { HeadingNode } from '$types/documents';

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

export const buildSummary = (body?: unknown): HeadingNode[] => {
  try {
    if (!Array.isArray(body)) {
      return [];
    }

    const headingBlocks = body.filter(isHeadingBlock);

    if (headingBlocks.length === 0) {
      return [];
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

    return tree;
  } catch (e) {
    const err =
      e instanceof Error ? e : new Error('Unknown error while building summary');
    Logger.error('Error building heading summary', err);
    return [];
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
