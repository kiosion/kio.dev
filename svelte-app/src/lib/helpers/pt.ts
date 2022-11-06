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
  const blocks = input.filter((block) => HeadingTypes.includes(block.style));
  const headings: Heading[] = (
    blocks as (Omit<PTBlock, 'style'> & { style: HeadingType })[]
  ).map((block) => {
    return {
      text: block.children[0].text,
      key: block._key,
      type: block.style,
      children: [] as Heading[]
    };
  });
  const getChildren = (input: Heading[]): Heading[] => {
    return input.reduce((acc, heading, index) => {
      for (let i = index + 1; i < input.length; i++) {
        const nextHeading = input[i];
        if (nextHeading.type.charAt(1) <= heading.type.charAt(1)) {
          break;
        }
        heading.children = [
          ...heading.children,
          ...getChildren(input.slice(i))
        ];
        const remChildren = (heading: Heading) => {
          heading.children.forEach((child) => {
            if (child.children.length > 0) {
              remChildren(child);
            }
            const childIndex = input.indexOf(child);
            childIndex > -1 && input.splice(childIndex, 1);
          });
        };
        remChildren(heading);
      }
      return [...acc, heading];
    }, [] as Heading[]);
  };
  return getChildren(headings);
};
