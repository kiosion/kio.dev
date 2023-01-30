import type { SanityAsset } from '$types/sanity';

export interface Comment extends SanityAsset {
  name: string;
  email: string;
  username: string;
  body: string;
  date: string;
  document: {
    _ref: string;
    _type: string;
  };
  parent?: Comment;
}
