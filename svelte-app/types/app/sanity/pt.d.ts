import type { BlockComponentProps } from '@portabletext/svelte';

export interface PTChild {
  _type: string;
  _key: string;
  text: string;
  marks: string[];
}

export interface PTMarkDef {
  _type: string;
  _key: string;
  href?: string;
}

export interface PTBlock {
  _type: 'block';
  _key: string;
  style: string;
  children: PTChild[];
  markDefs: PTMarkDef[];
}

export interface CodeBlockComponentProps
  extends Omit<BlockComponentProps, 'value'> {
  value: {
    _key: string;
    _type: string;
    code: string;
    language: string;
    filename?: string;
  };
}
