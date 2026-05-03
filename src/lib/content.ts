import type { Component } from 'svelte';

const slugFromPath = (path: string): string =>
  path.split('/').pop()!.replace(/\.md$/, '');

const sortByDateDesc = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

type ContentModule<M> = { default: Component; metadata: M };

export type LoadedContent<M> = M & {
  slug: string;
  Component: Component;
};

const loadOne = async <M>(
  modules: Record<string, () => Promise<ContentModule<M>>>,
  match: (path: string) => boolean = () => true,
): Promise<LoadedContent<M> | undefined> => {
  const entry = Object.entries(modules).find(([path]) => match(path));
  if (!entry) {
    return undefined;
  }
  const mod = await entry[1]();
  return {
    ...mod.metadata,
    slug: slugFromPath(entry[0]),
    Component: mod.default,
  };
};

export type PostMetadata = {
  title: string;
  date: string;
  desc?: string;
  tags?: string[];
  draft?: boolean;
};

export type Post = PostMetadata & { slug: string };
export type LoadedPost = LoadedContent<PostMetadata>;

const POSTS_EAGER = import.meta.glob<{ metadata: PostMetadata }>(
  '/src/content/posts/*.md',
  { eager: true },
);

const POSTS_LAZY = import.meta.glob<ContentModule<PostMetadata>>(
  '/src/content/posts/*.md',
);

export const getAllPosts = (): Post[] =>
  Object.entries(POSTS_EAGER)
    .map(([path, mod]) => ({ ...mod.metadata, slug: slugFromPath(path) }))
    .filter((p) => !p.draft)
    .sort(sortByDateDesc);

export const loadPost = async (slug: string): Promise<LoadedPost | undefined> => {
  const post = await loadOne<PostMetadata>(
    POSTS_LAZY,
    (path) => slugFromPath(path) === slug,
  );
  return post && !post.draft ? post : undefined;
};

export type AboutMetadata = { title: string[] };
export type LoadedAboutContent = LoadedContent<AboutMetadata>;

const ABOUT = import.meta.glob<ContentModule<AboutMetadata>>('/src/content/about.md');

export const loadAboutContent = (): Promise<LoadedAboutContent | undefined> =>
  loadOne<AboutMetadata>(ABOUT);

export type EtcMetadata = { title: string };
export type LoadedEtcContent = LoadedContent<EtcMetadata>;

const ETC = import.meta.glob<ContentModule<EtcMetadata>>('/src/content/etc.md');

export const loadEtcContent = (): Promise<LoadedEtcContent | undefined> =>
  loadOne<EtcMetadata>(ETC);
