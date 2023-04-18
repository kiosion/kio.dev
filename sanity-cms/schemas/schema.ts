import divider from './objects/divider';
import header from './objects/header';
import replitEmbed from './objects/replit-embed';
import svelteEmbed from './objects/svelte-embed';

import author from './author';
import comment from './comment';
import post from './post';
import project from './project';
import tag from './tag';
import siteSettings from './settings';

export const schemaTypes = [
  author,
  comment,
  divider,
  header,
  post,
  project,
  replitEmbed,
  svelteEmbed,
  tag,
  siteSettings
];
