import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import divider from './objects/divider';

import author from './author';
import post from './post';
import project from './project';
import tag from './tag';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([author, divider, post, project, tag])
});
