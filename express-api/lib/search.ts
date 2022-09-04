import algoliasearch from 'algoliasearch';
import { client } from '../client';
import { POSTS_PROJECTION } from '../queries';
import dotenv from 'dotenv';
import indexer from 'sanity-algolia';
import type { WebhookBody } from 'sanity-algolia/dist/types';
import { ALGOLIA_INDEX } from './env';

dotenv.config();

// Config algolia client
const algolia = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

const handler = (content: WebhookBody) => {
  const index = algolia.initIndex(ALGOLIA_INDEX);
  const sanityAlgolia = indexer(
    {
      post: {
        index,
        projection: POSTS_PROJECTION
      }
    },
    (document) => document
  );

  return sanityAlgolia
    .webhookSync(client, content)
    .then(() => {
      return {
        status: 200,
        message: 'Success',
        detail: ''
      };
    })
    .catch((err) => {
      return {
        status: 500,
        message: 'Something went wrong',
        detail: err.message ?? ''
      };
    });
};

export default handler;
