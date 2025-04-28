import { ENV } from '$lib/env';
import {
  SANITY_API_TOKEN,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID
} from '$lib/env.server';

import { ClientError, createClient } from '@sanity/client';

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: ENV === 'production',
  apiVersion: SANITY_API_VERSION,
  token: SANITY_API_TOKEN
});

const EXCLUDE_DRAFTS = "!(_id in path('drafts.**'))";

const handleNoResults = <T>(res: T): T | { status: number; errors: string[] } => {
  return res
    ? res
    : {
        status: 404,
        errors: ['No results found']
      };
};

const handleSanityError = (err: Error): { status: number; errors: string[] } => {
  const errorResp = {
    status: 500,
    errors: ['Failed to fetch data']
  };

  if (err instanceof ClientError) {
    errorResp.status = err.response?.statusCode || 500;
    errorResp.errors.push(
      `Sanity Error: ${err.details.type}: ${err.details.description}`
    );
  } else {
    errorResp.errors.push(err.message || 'An unknown error occurred');
  }

  return errorResp;
};

export const incViews = async ({ id }: { id: string }) => {
  const res = await client
    .patch(id)
    .setIfMissing({ views: 0 })
    .inc({ views: 1 })
    .commit()
    .catch((err) => {
      if (err instanceof ClientError) {
        return {
          status: err.response?.statusCode || 500,
          errors: [`Sanity Error: ${err.details.type}: ${err.details.description}`]
        };
      }
      return {
        status: 500,
        errors: [err.message || 'An unknown error occurred']
      };
    });

  if (res.errors) {
    return res;
  }

  return {
    status: 200,
    errors: []
  };
};

export const getPosts = async ({
  tag,
  page = 0,
  limit = 10,
  sort = 'date',
  order = 'desc',
  preview = false
}: {
  tag?: string;
  page?: number;
  limit?: number;
  sort?: 'date' | 'title' | 'views' | 'publishedAt';
  order?: 'asc' | 'desc';
  preview?: boolean;
}) => {
  const startNumber = page * limit;
  const endNumber = startNumber + limit;
  const tagFilter = tag
    ? ` && references(*[_type == 'tag' && slug.current == ${tag}][0]._id)`
    : '';
  const sortOrder = `${sort} ${order}`;

  const query = `*[${!preview ? `${EXCLUDE_DRAFTS} && ` : ''}_type == 'post'${tagFilter}]{
  _id,
  'objectID': _id,
  _rev,
  _type,
  title,
  publishedAt,
  tags[]->{
    _id,
    title,
    slug
  },
  slug,
  body,
  desc,
  date,
  views,
  'numberOfCharacters': length(pt::text(body)),
  'estimatedWordCount': round(length(pt::text(body)) / 5),
  'estimatedReadingTime': round(length(pt::text(body)) / 5 / 120)
} | order($sortOrder) [$startNumber...$endNumber]`;

  const posts = await client
    .fetch(query, {
      startNumber,
      endNumber,
      sortOrder
    })
    .then(handleNoResults)
    .catch(handleSanityError);

  if (posts.errors) {
    return posts;
  }

  const totalPostsQuery = await client.fetch(
    `count(*[!(_id in path('drafts.**')) && _type == 'post'${tagFilter}])`
  );
  const totalPosts = parseInt(totalPostsQuery, 10);
  const totalPages = Math.ceil(totalPosts / limit);
  const hasMore = totalPosts > endNumber;
  const hasLess = startNumber > 0;

  return {
    status: 200,
    errors: [],
    data: posts,
    meta: {
      total: totalPosts,
      count: posts.length,
      hasMore,
      hasLess,
      page: {
        current: page,
        total: totalPages
      }
    }
  };
};

type GetPostParams = {
  preview?: boolean;
} & ({ slug: string; id?: never } | { slug?: never; id: string });

export const getPost = async ({ slug, id, preview }: GetPostParams) => {
  const idOrSlugFilter = id ? `&& _id == '${id}'` : `&& slug.current == '${slug}'`;

  const query = `*[${!preview ? `${EXCLUDE_DRAFTS} && ` : ''}_type == 'post' ${idOrSlugFilter}]{
  _id,
  'objectID': _id,
  _rev,
  _type,
  title,
  publishedAt,
  tags[]->{
    _id,
    title,
    slug
  },
  slug,
  body,
  desc,
  date,
  'views': coalesce(views, 0),
  'numberOfCharacters': length(pt::text(body)),
  'estimatedWordCount': round(length(pt::text(body)) / 5),
  'estimatedReadingTime': round(length(pt::text(body)) / 5 / 120)
}[0]`;

  const postQuery = await client
    .fetch(query)
    .then(handleNoResults)
    .catch(handleSanityError);

  if (postQuery.errors) {
    return postQuery;
  }

  return {
    status: 200,
    errors: [],
    data: postQuery,
    meta: {
      total: 1,
      count: 1
    }
  };
};

export const getProjects = async ({
  tag,
  page = 0,
  limit = 10,
  sort = 'date',
  order = 'desc',
  preview = false
}: {
  tag?: string;
  page?: number;
  limit?: number;
  sort?: 'date' | 'title' | 'views';
  order?: 'asc' | 'desc';
  preview?: boolean;
}) => {
  const startNumber = page * limit;
  const endNumber = startNumber + limit;
  const tagFilter = tag
    ? ` && references(*[_type == 'tag' && slug.current == ${tag}][0]._id)`
    : '';
  const sortOrder = `${sort} ${order}`;

  const query = `*[${!preview ? `${EXCLUDE_DRAFTS} && ` : ''}_type == 'project'${tagFilter}]{
  _id,
  'objectID': _id,
  _rev,
  _type,
  title,
  publishedAt,
  tags[]->{
    _id,
    title,
    slug
  },
  slug,
  body,
  desc,
  date,
  images,
  'views': coalesce(views, 0),
  'numberOfCharacters': length(pt::text(body)),
  'estimatedWordCount': round(length(pt::text(body)) / 5),
  'estimatedReadingTime': round(length(pt::text(body)) / 5 / 120)
} | order($sortOrder) [$startNumber...$endNumber]`;

  const projects = await client
    .fetch(query, {
      startNumber,
      endNumber,
      sortOrder
    })
    .then(handleNoResults)
    .catch(handleSanityError);

  if (projects.errors) {
    return projects;
  }

  const totalProjectsQuery = await client.fetch(
    `count(*[!(_id in path('drafts.**')) && _type == 'project'${tagFilter}])`
  );

  const totalProjects = parseInt(totalProjectsQuery, 10);
  const totalPages = Math.ceil(totalProjects / limit);
  const hasMore = totalProjects > endNumber;
  const hasLess = startNumber > 0;

  return {
    status: 200,
    errors: [],
    data: projects,
    meta: {
      total: totalProjects,
      count: projects.length,
      hasMore,
      hasLess,
      page: {
        current: page,
        total: totalPages
      }
    }
  };
};

type GetProjectParams = {
  preview?: boolean;
} & ({ slug: string; id?: never } | { slug?: never; id: string });

export const getProject = async ({ slug, id, preview }: GetProjectParams) => {
  const idOrSlugFilter = id ? `&& _id == '${id}'` : `&& slug.current == '${slug}'`;

  const query = `*[${!preview ? `${EXCLUDE_DRAFTS} && ` : ''}_type == 'project' ${idOrSlugFilter}]{
  _id,
  'objectID': _id,
  _rev,
  _type,
  title,
  publishedAt,
  tags[]->{
    _id,
    title,
    slug
  },
  slug,
  body,
  desc,
  date,
  images,
  'views': coalesce(views, 0),
  'numberOfCharacters': length(pt::text(body)),
  'estimatedWordCount': round(length(pt::text(body)) / 5),
  'estimatedReadingTime': round(length(pt::text(body)) / 5 / 120)
}[0]`;

  const projectQuery = await client
    .fetch(query)
    .then(handleNoResults)
    .catch(handleSanityError);

  if (projectQuery.errors) {
    return projectQuery;
  }

  return {
    status: 200,
    errors: [],
    data: projectQuery,
    meta: {
      total: 1,
      count: 1
    }
  };
};

export const getConfig = async () => {
  const query = "*[!(_id in path('drafts.**')) && _type == 'siteSettings'][0]";

  const config = await client.fetch(query).then(handleNoResults).catch(handleSanityError);

  if (config.errors) {
    return config;
  }

  return {
    status: 200,
    errors: [],
    data: config,
    meta: {
      total: 1,
      count: 1
    }
  };
};
