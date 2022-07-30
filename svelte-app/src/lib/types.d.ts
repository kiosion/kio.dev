export interface Post {
  _id?: string;
  _type?: string;
  author?: {
    _id: string;
    _type: string;
    name: string;
    slug: string;
  };
  slug?: {
    _type: string;
    current: string;
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
}

export interface Posts {
  meta: {
    count: number;
    filter: string;
  };
  posts?: Post[];
  error?: {
    message: string;
  };
}

export interface PostsQueryParams {
  limit?: number;
  skip?: number;
  sort?: string;
  order?: string;
  date?: string;
  tags?: string[];
}

export interface PostQueryParams {
  slug?: string;
}

export interface RouteFetch {
  (info: RequestInfo, init?: RequestInit): Promise<Response>;
}
