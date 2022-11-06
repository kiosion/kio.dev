import type { PTBlock } from '$lib/types';

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

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4';
const HeadingTypes = ['h1', 'h2', 'h3', 'h4'];

export type Heading = {
  text: string;
  key: string;
  type: HeadingType;
  children: Heading[];
};

export const getHeadings = (input: PTBlock[]): Heading[] => {
  console.log(input);
  const headings = (
    input.filter((block) => HeadingTypes.includes(block.style)) as (Omit<
      PTBlock,
      'style'
    > & { style: HeadingType })[]
  ).map((block) => {
    return {
      text: block.children[0].text,
      key: block._key,
      type: block.style,
      children: [] as Heading[]
    };
  });

  const makeTree = (headings: Heading[]): Heading[] => {
    const tree: Heading[] = [];
    let current: Heading | undefined;
    headings.forEach((heading) => {
      current = current || heading;
      const currentType = parseInt(current?.type.charAt(1) ?? '1'),
        headingType = parseInt(heading.type.charAt(1));
      switch (true) {
        case headingType === 1:
          tree.push(heading);
          break;
        case headingType > currentType:
          current.children.push(heading);
          break;
        default:
          tree.push(heading);
          break;
      }
      current = heading;
    });
    return tree;
  };

  return makeTree(headings);
};
