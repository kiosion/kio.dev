export interface SingleDocumentQueryParams {
  slug?: string;
  id?: string;
}

export interface DocumentQueryParams {
  limit?: number;
  skip?: number;
  sort?: string;
  order?: string;
  date?: string;
  tags?: string[];
}

export interface ResData<T> {
  meta: {
    count: string | number;
    total: string | number;
    filter: string;
  };
  data: T;
}
