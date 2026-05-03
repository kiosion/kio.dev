import { readdirSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const VIRTUAL_ID = 'virtual:posts-manifest';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * @param {string} filePath
 * @returns {Record<string, unknown>}
 */
const parseFrontmatter = (filePath) => {
  const source = readFileSync(filePath, 'utf8');
  const match = source.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`No frontmatter in ${filePath}`);
  }
  const parsed = yaml.load(match[1]);
  if (parsed === null || typeof parsed !== 'object') {
    throw new Error(`Invalid frontmatter in ${filePath}`);
  }
  return /** @type {Record<string, unknown>} */ (parsed);
};

/**
 * @param {string} postsDir
 */
const buildManifest = (postsDir) =>
  readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({
      ...parseFrontmatter(path.join(postsDir, f)),
      slug: f.replace(/\.md$/, ''),
    }));

/**
 * Vite plugin that exposes a `virtual:posts-manifest` module containing the
 * frontmatter (plus `slug`) of every post in `postsDir`. Lets the listing read
 * post metadata without statically importing the .md modules — so Rollup can
 * split each post into its own chunk via the lazy `import.meta.glob`.
 *
 * @param {{ postsDir: string }} options
 * @returns {import('vite').Plugin}
 */
export default function postsManifestPlugin({ postsDir }) {
  const absPostsDir = path.resolve(postsDir);
  return {
    name: 'posts-manifest',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      const posts = buildManifest(absPostsDir);
      return `export const posts = ${JSON.stringify(posts)};`;
    },
    configureServer(server) {
      const onChange = (/** @type {string} */ filePath) => {
        if (!filePath.startsWith(absPostsDir) || !filePath.endsWith('.md')) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      };
      server.watcher.on('add', onChange);
      server.watcher.on('change', onChange);
      server.watcher.on('unlink', onChange);
    },
  };
}
