import type { PTBlock } from '$types/sanity';

export const getTotalWords = (postBody: PTBlock[]) => {
  if (!postBody) {
    return 0;
  }

  const text: string[] = [];

  for (const block of postBody) {
    if (block._type !== 'block' || !block.children.length) {
      continue;
    }

    for (const item of block.children) {
      if (item.text.length > 0) {
        text.push(item.text);
      }
    }
  }

  return text
    .join(' ')
    .split(/\s+/)
    .filter((word) => word.length > 1).length;
};
