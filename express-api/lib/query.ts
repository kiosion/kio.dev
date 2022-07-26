import SanityClient from '../client';
import { postsQueryParams, postsQueryFilterParams, postQueryParams } from '../types';

const client = SanityClient.client;

module query {
  // Fetch range of posts, by date, tags, or all
  export const posts = (
    { limit = 10, skip = 0, sort = 'date', order = 'desc' }: postsQueryParams,
    filter: postsQueryFilterParams = {}
  ) =>
    new Promise((resolve, reject) => {
      let date: string | undefined = undefined,
        tags: string | undefined = undefined;

      if (filter.date && filter.date?.length > 0) {
        const split = filter.date.split('-');
        if (
          split.length !== 3 ||
          !split[0].match(/^\d+$/) ||
          !split[1].match(/^\d+$/) ||
          !split[2].match(/^\d+$/)
        ) {
          reject('Invalid date format, must be YYYY-MM-DD, you provided: ' + filter.date);
        }
        date = `${split[0]}-${split[1]}-${split[2]}`;
      }

      if (filter.tags && filter.tags?.length > 0) {
        tags = filter.tags
          ?.map((tag) => {
            return tag !== '' && `'${tag}'`;
          })
          ?.join(', ');
      }

      limit > 50 ? 50 : limit;
      order !== 'desc' ? (order = 'asc') : (order = 'desc');

      const query = `*[!(_id in path('drafts.**')) && _type == "post"${
        date ? ` && date == "${date}"` : ''
      }${tags ? ` && references(*[_type == "tag" && title in [${tags}]]._id)` : ''}]{
      _id,
      _type,
      "author": {
        "_id": author->_id,
        "_type": author->_type,
        "name": author->name,
        "slug": author->slug
      },
      body,
      desc,
      date,
      "tags": tags[]->{
        _id,
        title,
        slug
      },
      slug,
      title
    } | order(${sort} ${order}) [${skip}...${limit}]`;

      client
        .fetch(query)
        .then((data: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          resolve({
            meta: {
              count: data.length,
              sort,
              order
            },
            data
          });
        })
        .catch((err: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          reject(err);
        });
    });

  // Fetch single post by unique slug or id
  export const post = ({ slug = '', id = '' }: postQueryParams) =>
    new Promise((resolve, reject) => {
      if ((!slug && !id) || (slug === '' && id === '')) {
        reject('Invalid params provided. Post slug or ID must be provided.');
      }

      const query = `*[!(_id in path('drafts.**')) && _type == "post"${
        slug !== '' ? ` && slug.current == "${slug}"` : ''
      }${id !== '' ? ` && _id == "${id}"` : ''}]{
      _id,
      _type,
      "author": {
        "_id": author->_id,
        "_type": author->_type,
        "name": author->name,
        "slug": author->slug
      },
      body,
      desc,
      date,
      tags[]->{
        _id,
        title,
        slug
      },
      slug,
      title
    }[0]`;

      client
        .fetch(query)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any) => {
          resolve({
            meta: {
              count: data ? 1 : 0,
              filter: `${slug ? slug : id}`
            },
            data
          });
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
          reject(err);
        });
    });

  // Fetch list of all tags
  export const tags = ({ limit = 0 }) =>
    new Promise((resolve, reject) => {
      if (limit < 1) {
        reject('Invalid limit');
      }

      const query = `*[_type == "tag"]{
      _id,
      _type,
      title,
      slug
    } | order(title asc) [0...${limit}]`;

      client
        .fetch(query)
        .then((data: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          resolve({
            meta: {
              count: data.length
            },
            data
          });
        })
        .catch((err: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          reject(err);
        });
    });
}

export default query;
