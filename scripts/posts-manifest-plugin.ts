import { readdirSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import type { Plugin, ViteDevServer } from 'vite';

const VIRTUAL_ID = 'virtual:posts-manifest';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

const parseFrontmatter = (filePath: string): Record<string, unknown> => {
  const source = readFileSync(filePath, 'utf8');
  const match = source.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`No frontmatter in ${filePath}`);
  }
  const parsed = yaml.load(match[1]);
  if (parsed === null || typeof parsed !== 'object') {
    throw new Error(`Invalid frontmatter in ${filePath}`);
  }
  return parsed as Record<string, unknown>;
};

const buildManifest = (postsDir: string) =>
  readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({
      ...parseFrontmatter(path.join(postsDir, f)),
      slug: f.replace(/\.md$/, ''),
    }));

export interface PostsManifestOptions {
  postsDir: string;
}

/**
 * Vite plugin that exposes a `virtual:posts-manifest` module containing the
 * frontmatter (plus `slug`) of every post in `postsDir`. Lets the listing read
 * post metadata without statically importing the .md modules — so Rollup can
 * split each post into its own chunk via the lazy `import.meta.glob`.
 */
export default function postsManifestPlugin({ postsDir }: PostsManifestOptions): Plugin {
  const absPostsDir = path.resolve(postsDir);
  return {
    name: 'posts-manifest',
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID;
      }
    },
    load(id) {
      if (id !== RESOLVED_ID) {
        return;
      }
      const posts = buildManifest(absPostsDir);
      return `export const posts = ${JSON.stringify(posts)};`;
    },
    configureServer(server: ViteDevServer) {
      const onChange = (filePath: string) => {
        if (!filePath.startsWith(absPostsDir) || !filePath.endsWith('.md')) {
          return;
        }
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
