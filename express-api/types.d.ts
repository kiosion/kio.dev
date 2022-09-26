export interface Error {
  code?: number;
  message?: string;
}

export interface JsonError extends Error {
  detail?: string;
}

export type queryResponse = {
  meta: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type postsQueryParams = {
  limit?: number | string;
  skip?: number | string;
  sort?: 'date' | 'title';
  order?: 'asc' | 'desc';
  tags?: string[];
};

export type postQueryParams = {
  slug?: string;
  id?: string;
};

export type postsQueryFilterParams = {
  date?: string;
  tags?: string[];
};

export type projectsQueryParams = {
  limit?: number | string;
  skip?: number | string;
  sort?: 'date' | 'title';
  order?: 'asc' | 'desc';
};

export type projectsQueryFilterParams = {
  date?: string;
  tags?: string[];
};

export type postsQueryResult = {
  []: postQueryResult;
};

export type postQueryResult = {
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

export type tagsQueryResult = {
  []: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
