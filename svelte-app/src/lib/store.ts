// // import type { NumericRange } from '@sveltejs/kit';
// // import type { RouteFetch } from '$types';
// // import type { Post, Project, SiteSettings, Tag } from '$types/sanity';
// // export interface DocumentRegistry {
// //   config: SiteSettings;
// //   post: Post;
// //   project: Project;
// //   tag: Tag;
// // }

// // export type Model = keyof DocumentRegistry;

// // const getOne = <M extends Model>(
// //   fetch: RouteFetch,
// //   model: M,
// //   params: QueryParams<M> = {},
// //   opts: FetchOpts = {}
// // ): Promise<DocumentRegistry[M]> => {
// //   return withCache(model, params, opts.cache, () =>
// //     request<DocumentRegistry[m]>(fetch, model, params, false)
// //   );
// // };

// // const getMany = <M extends Model>(
// //   fetch: RouteFetch,
// //   model: M,
// //   params: QueryParams<M> = {},
// //   opts: FetchOpts = {}
// // ): Promise<DocumentRegistry[M][]> => {
// //   return withCache(model, params, opts.cache, () =>
// //     request<DocumentRegistry[M][]>(fetch, model, params, true)
// //   );
// // };

// // type APIMeta<T> =
// //   T extends ArrayLike<unknown>
// //     ? {
// //         count: number;
// //         total: number;
// //         page: {
// //           current: number;
// //           total: number;
// //         };
// //       }
// //     : undefined;

// // type APISuccess<T> = {
// //   data: T;
// //   meta: APIMeta<T>;
// //   errors: string[];
// //   status: NumericRange<200, 299>;
// // };

// // type APIFailure = {
// //   data: never;
// //   meta: never;
// //   errors: string[];
// //   status: NumericRange<400, 599>;
// // };

// // type APIResponse<T> = APISuccess<T> | APIFailure;

// // type Filter = {
// //   page?: number;
// //   limit?: number;
// //   sort?: 'date' | 'title' | 'views' | 'publishedAt';
// //   order?: 'asc' | 'desc';
// // };

// // type SlugOrId =
// //   | {
// //       slug: string;
// //       id?: never;
// //     }
// //   | {
// //       slug?: never;
// //       id: string;
// //     };

// // type QueryParams<M extends Model> = M extends 'post'
// //   ? Partial<{ preview: boolean }> & SlugOrId
// //   : M extends 'project'
// //   ? Partial<{ preview: boolean }> & SlugOrId

// import { browser } from '$app/environment';
// import { tryFetch } from '$lib/data';
// import { API_URL } from '$lib/env';
// import Logger from '$lib/logger';

// import type { NumericRange } from '@sveltejs/kit';
// import type { RouteFetch } from '$types';
// import type { Post, Project, SiteSettings, Tag } from '$types/sanity';

// export interface DocumentRegistry {
//   config: SiteSettings;
//   post: Post;
//   project: Project;
//   tag: Tag;
// }

// export type APIResponse<T> =
//   | {
//       data: T;
//       meta: T extends ArrayLike<unknown>
//         ? {
//             count: number;
//             total: number;
//             page: {
//               current: number;
//               total: number;
//             };
//           }
//         : never;
//       errors: string[];
//       status: NumericRange<200, 299>;
//     }
//   | {
//       data: never;
//       meta: never;
//       errors: string[];
//       status: NumericRange<400, 599>;
//     };

// type FilterQueryParams = {
//   page?: number;
//   limit?: number;
//   sort?: 'date' | 'title' | 'views' | 'publishedAt';
//   order?: 'asc' | 'desc';
// };

// type PostQueryParams = {
//   preview?: boolean;
// } & ({ slug: string; id?: never } | { slug?: never; id: string });

// type ProjectQueryParams = {
//   preview?: boolean;
// } & ({ slug: string; id?: never } | { slug?: never; id: string });

// type PostsQueryParams = {
//   tags?: string[];
// } & FilterQueryParams;

// type ProjectsQueryParams = {
//   tags?: string[];
// } & FilterQueryParams;

// // Issue: this doesn't account for extra params on 'posts' and 'projects' queries...
// type DocumentQueryParams<T extends keyof DocumentRegistry> = T extends 'post'
//   ? PostQueryParams
//   : T extends 'project'
//     ? ProjectQueryParams
//     : T extends 'tag'
//       ? PostsQueryParams | ProjectsQueryParams
//       : FilterQueryParams;

// const EXP_TIME = 1000 * 60 * 15; // 15 minutes

// const documentCache: Record<
//   string,
//   {
//     exp: number;
//     data:
//       | DocumentRegistry[keyof DocumentRegistry]
//       | DocumentRegistry[keyof DocumentRegistry][];
//   }
// > = {};

// const cacheGet = (key: string) => {
//   const item = documentCache[key];
//   if (!item || isExpired(item.exp)) {
//     delete documentCache[key];
//     return undefined;
//   }
//   return item.data;
// };

// const cacheSet = (
//   key: string,
//   value:
//     | DocumentRegistry[keyof DocumentRegistry]
//     | DocumentRegistry[keyof DocumentRegistry][]
// ) => {
//   documentCache[key] = {
//     exp: Date.now() + EXP_TIME,
//     data: value
//   };
// };

// const isExpired = (timestamp: number): boolean => timestamp <= Date.now();

// const constructUrl = (
//   model: keyof DocumentRegistry,
//   params: URLSearchParams,
//   many = false
// ) => {
//   const basePath = `${API_URL}get/${model}${many ? '/many' : ''}`,
//     queryParams = [];

//   for (const [key, value] of Object.entries(params)) {
//     if (Array.isArray(value) && value.length) {
//       queryParams.push(`${key}=${value.join(',')}`);
//     } else if (value !== null && value !== undefined && value.toString() !== '') {
//       queryParams.push(`${key}=${value}`);
//     }
//   }

//   return `${basePath}${queryParams.length ? `?${queryParams.join('&')}` : ''}`;
// };

// export const incViews = async (
//   fetch: RouteFetch,
//   doc: DocumentRegistry[keyof DocumentRegistry]
// ) => {
//   if (doc._type !== 'post' && doc._type !== 'project') {
//     return;
//   }

//   try {
//     const res = await fetch(`${API_URL}mutate`, {
//       method: 'POST',
//       body: JSON.stringify({
//         id: doc._id,
//         action: 'inc',
//         field: 'views'
//       })
//     });

//     if (!res.ok) {
//       Logger.error(`Failed to increment views for ${doc._type} ${doc._id}`, {
//         status: res.status,
//         statusText: res.statusText
//       });
//     }
//   } catch (e) {
//     Logger.error('Error incrementing views', e);
//   }
// };

// const fetchData = async <T>(
//   fetch: RouteFetch,
//   url: string,
//   model: keyof DocumentRegistry
// ): Promise<T | Error> => {
//   try {
//     const response = await tryFetch(fetch(url));
//     const fetchResponse = (await response.json().catch((e) => {
//       return {
//         errors: [e.message || 'Failed to parse response.']
//       };
//     })) as APIResponse<T>;

//     if (fetchResponse?.errors?.length) {
//       Logger.error(`Errors occured fetching ${model}.`, fetchResponse?.errors);
//     }

//     if (
//       !(fetchResponse?.meta && fetchResponse?.data) ||
//       (!Array.isArray(fetchResponse?.data) &&
//         typeof fetchResponse?.data === 'object' &&
//         Object.keys(fetchResponse.data).length === 0) ||
//       (Array.isArray(fetchResponse?.data) &&
//         !fetchResponse?.meta &&
//         fetchResponse?.data.length === 0)
//     ) {
//       const err = new Error(`Failed to fetch ${model} data.`);

//       err.code = (response.status || 500) as NumericRange<400, 599>;
//       err.cause =
//         fetchResponse?.errors || (!fetchResponse?.data && new Error('No data present'));

//       return err;
//     }

//     return fetchResponse.data;
//   } catch (e) {
//     Logger.error(`Failed to fetch ${model}.`, e);
//     return new Error(`Failed to fetch ${model} data.`, { cause: e });
//   }
// };

// const find = async <T extends keyof DocumentRegistry>(
//   fetch: RouteFetch,
//   model: T,
//   params: DocumentQueryParams<T> = {}
// ): Promise<DocumentRegistry[T][] | Error> => {
//   const cacheKey = JSON.stringify({ model, params, many: true });
//   if (browser && params.preview !== 'true') {
//     const cachedData = cacheGet(cacheKey);
//     if (cachedData) {
//       return cachedData as DocumentRegistry[T][];
//     }
//   }

//   const url = constructUrl(model, params, true);
//   const response = await fetchData<DocumentRegistry[T][]>(fetch, url, model);
//   if (browser && params.preview !== 'true' && response && !(response instanceof Error)) {
//     cacheSet(cacheKey, response);
//   }

//   return response;
// };

// // TODO: These types are a fucking mess and desperately need a refactor but honestly it _works_ and I can't be fucked
// const findOne = async <T extends keyof DocumentRegistry>(
//   fetch: RouteFetch,
//   model: T,
//   params: DocumentQueryParams<T> = {}
// ): Promise<DocumentRegistry[T] | Error> => {
//   const cacheKey = JSON.stringify({ model, params, many: false }),
//     url = constructUrl(model, params);

//   if (browser && params.preview !== 'true') {
//     const cachedData = cacheGet(cacheKey);
//     if (cachedData) {
//       return cachedData as DocumentRegistry[T];
//     }
//   }

//   const response = await fetchData<DocumentRegistry[T]>(fetch, url, model);
//   if (browser && params.preview !== 'true' && response && !(response instanceof Error)) {
//     cacheSet(cacheKey, response);
//   }

//   return response;
// };

// export { find, findOne };
