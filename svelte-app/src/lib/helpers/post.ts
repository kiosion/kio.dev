export const getTotalWords = (postBody: Array<TextBlock>) => {
  if (!postBody) {
    return [];
  }

  const blocks = postBody
    ?.filter((block: TextBlock) => block._type === 'block')
    ?.reduce((prev: Array<TextBlock>, item: TextBlock) => {
      return [...prev, item];
    }, []);

  const text: string[] = [];

  blocks
    ?.filter((block: TextBlock) => block.children.length)
    ?.forEach((block: TextBlock) => {
      text.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        block.children.reduce((prev: any[], item: any) => {
          if (item.text.length > 0) {
            return [...prev, item.text];
          }
        }, []) as unknown as string
      );
    });

  return text.flat().filter((text: string) => text);
};
