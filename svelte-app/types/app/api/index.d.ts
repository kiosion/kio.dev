// Params
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

// Responses
export interface ResData<T> {
  meta: {
    count: string | number;
    total: string | number;
    filter: string;
  };
  data: T;
}

export interface ResError {
  code: string | number;
  error: string;
  status: string;
}

export interface ResDataMany<T> extends Omit<ResData, 'data'> {
  data: T[];
}

export type StoreRes<T> = T | undefined;

export interface ExternalUserInfo {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
}
