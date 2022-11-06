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

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
const HeadingTypes = ['h1', 'h2', 'h3', 'h4', 'h5'];

export type Heading = {
  text: string;
  key: string;
  type: HeadingType;
  children: Heading[];
  parent?: Heading['key'];
};

export const getHeadings = (input: PTBlock[]): Heading[] => {
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
      children: [] as Heading[],
      parent: undefined
    };
  });

  const makeTree = (headings: Heading[]): Heading[] => {
    const tree: Heading[] = [];
    let current: Heading | undefined;
    headings.forEach((heading) => {
      current = current || heading;
      const checkForParent = (current: Heading, heading: Heading): void => {
        if (current.parent) {
          const parent = headings.find((h) => h.key === current.parent);
          if (parent) {
            if (
              parseInt(parent.type.charAt(1)) >=
              parseInt(heading.type.charAt(1))
            ) {
              return checkForParent(parent, heading);
            }
            heading.parent = parent.key;
            parent.children.push(heading);
            return;
          }
        }
        // If no parent, push to root
        tree.push(heading);
      };
      switch (true) {
        // If the heading is smaller than the current heading, it's a child
        case parseInt(heading.type.charAt(1)) >
          parseInt(current.type.charAt(1)):
          heading.parent = current.key;
          current.children.push(heading);
          break;
        // If the heading is the same level as the current heading, check for a parent
        case parseInt(heading.type.charAt(1)) ===
          parseInt(current.type.charAt(1)):
          checkForParent(current, heading);
          break;
        // Fall back to checking for a parent
        default:
          checkForParent(current, heading);
          break;
      }
      current = heading;
    });
    return tree;
  };

  return makeTree(headings);
};
