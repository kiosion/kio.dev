import sanityClient from '@sanity/base';

const query = `
  *[ _type in ["sanity.imageAsset", "sanity.fileAsset"] ]
  {_id, "refs": count(*[ references(^._id) ])}
  [ refs == 0 ]
  ._id
`;

const client = sanityClient.withConfig({ apiVersion: '2022-08-23' });

client
  .fetch(query)
  .then((ids) => {
    if (!ids.length) {
      console.log('No assets to delete');
      return true;
    }

    console.log(`Deleting ${ids.length} assets...`);
    return ids
      .reduce((trx, id) => trx.delete(id), client.transaction())
      .commit()
      .then(() => console.log('Done!'));
  })
  .catch((err) => {
    if (err.message.includes('Insufficient permissions')) {
      console.error(err.message);
      console.error('Did you forget to pass `--with-user-token`?');
    } else {
      console.error(err.stack);
    }
  });
