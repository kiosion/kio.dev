import algoliasearch from 'algoliasearch';
import sanityClient from '@sanity/client';
import dotenv from 'dotenv';
import indexer, { flattenBlocks } from 'sanity-algolia';

dotenv.config();

// Config algolia client
const algolia = algoliasearch({});

// Config sanity client
const sanity = sanityClient({});

const handler = (req, res) => {
  const sanityAlgolia = indexer(
    {
      post: {
        index: algolia.initIndex('posts')
      }
    },
    (document) => {
      switch (document._type) {
        case 'post':
          return {
            title: document.title,
            path: document.slug.current,
            date: document.date,
            exerpt: flattenBlocks(document.desc)
          };
        default:
          throw new Error(`Unknown or unsupported type: ${document._type}`);
      }
    }
  );

  return sanityAlgolia
    .webhookSync(sanity, req.body)
    .then(() => res.status(200).send('ok'));
};

export default handler;
