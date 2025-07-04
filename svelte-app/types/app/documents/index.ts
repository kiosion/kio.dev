export type HeadingNode = {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  typeLevel: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  key: string;
  parent: string | null;
  children?: HeadingNode[];
};
