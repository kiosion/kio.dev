export type Post = {
  _id?: string;
  _type?: string;
  author?: {
    _id: string;
    _type: string;
    name: string;
    slug: string;
  };
  body?: {
    [
      _key?: string,
      _type?: string,
      children?: {
        [_key: string, _type: string, marks?: [string], text: string];
      },
      markDefs?: [
        {
          _key: string;
          _type: string;
          href?: string;
        }
      ]
    ];
  };
  date?: string;
  desc?: string;
  tags?: [
    {
      _id?: string;
      slug?: {
        _type: string;
        current: string;
      };
      title?: string;
    }
  ];
  title?: string;
};

export type Posts = {
  []: Post;
  length: number;
};
