import type { Component } from 'svelte';

export type PostMetadata = {
  title: string;
  date: string;
  desc?: string;
  tags?: string[];
  draft?: boolean;
};

export type Post = PostMetadata & {
  slug: string;
};

export type LoadedPost = Post & {
  Component: Component;
};

const slugFromPath = (path: string): string =>
  path.split('/').pop()!.replace(/\.md$/, '');

const sortByDateDesc = (a: Post, b: Post) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/**
 * All published posts, sorted newest first. Frontmatter only — no component.
 * Safe to call from server loads (returns serializable data).
 */
export const getAllPosts = (): Post[] => {
  const modules = import.meta.glob<{ metadata: PostMetadata }>(
    '/src/content/posts/*.md',
    { eager: true },
  );

  return Object.entries(modules)
    .map(([path, mod]) => ({
      ...mod.metadata,
      slug: mod.metadata.title ? slugFromPath(path) : slugFromPath(path),
    }))
    .filter((p) => !p.draft)
    .sort(sortByDateDesc);
};

/**
 * Lazily resolves a single post by slug, returning the Svelte component along with
 * its metadata. Must be called from a universal load (`+page.ts`) since the
 * component reference is not serializable.
 */
export const loadPost = async (slug: string): Promise<LoadedPost | undefined> => {
  const modules = import.meta.glob<{
    default: Component;
    metadata: PostMetadata;
  }>('/src/content/posts/*.md');

  const match = Object.entries(modules).find(([path]) => slugFromPath(path) === slug);

  if (!match) {
    return undefined;
  }

  const mod = await match[1]();

  if (mod.metadata.draft) {
    return undefined;
  }

  return {
    ...mod.metadata,
    slug,
    Component: mod.default,
  };
};
