import type { PTBlock } from '$types/sanity';

export const getTotalWords = (postBody: PTBlock[]) => {
  if (!postBody) {
    return [];
  }

  const blocks = postBody
    ?.filter((block) => block._type === 'block')
    ?.reduce((prev, item) => {
      return [...prev, item];
    }, [] as PTBlock[]);

  const text: string[] = [];

  blocks
    ?.filter((block) => block.children.length)
    ?.forEach((block) =>
      text.push(
        // @ts-expect-error Too lazy to refactor this
        block.children.reduce((prev, item) => {
          if (item.text.length > 0) {
            return [...prev, item.text];
          }
        }, [])
      )
    );

  return text.flat().filter((text: string) => text);
};
