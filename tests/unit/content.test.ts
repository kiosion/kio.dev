import { readdirSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import { join, resolve } from 'path';
import { describe, expect, it } from 'vitest';

import { APP_ROUTES, NAV_LINKS } from '../../src/lib/consts';
import { siteConfig } from '../../src/lib/site-config';

// Mirrors scripts/posts-manifest-plugin.ts so these assertions guard the exact
// frontmatter the build reads. Catches a malformed/missing-field post before deploy.
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
// vitest runs from the project root; resolve from cwd (jsdom mangles import.meta.url).
const POSTS_DIR = resolve(process.cwd(), 'src/content/posts');

const postFiles = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

const frontmatter = (file: string): Record<string, unknown> => {
  const match = readFileSync(join(POSTS_DIR, file), 'utf8').match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`No frontmatter block in ${file}`);
  }
  return yaml.load(match[1]) as Record<string, unknown>;
};

describe('post frontmatter', () => {
  it('has at least one post', () => {
    expect(postFiles.length).toBeGreaterThan(0);
  });

  it('has unique, url-safe slugs', () => {
    const slugs = postFiles.map((f) => f.replace(/\.md$/, ''));
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it.each(postFiles)('%s has valid required frontmatter', (file) => {
    const fm = frontmatter(file);
    // layout: post is required for the post title-bar wrapper; without it the post renders raw.
    expect(fm.layout).toBe('post');
    expect(typeof fm.title).toBe('string');
    expect((fm.title as string).length).toBeGreaterThan(0);
    // js-yaml parses an unquoted YYYY-MM-DD as a Date; new Date() accepts Date or string.
    expect(fm.date).toBeDefined();
    expect(Number.isNaN(new Date(fm.date as string | Date).getTime())).toBe(false);
    if (fm.tags !== undefined) {
      expect(Array.isArray(fm.tags)).toBe(true);
      expect((fm.tags as unknown[]).every((t) => typeof t === 'string')).toBe(true);
    }
    if (fm.draft !== undefined) {
      expect(typeof fm.draft).toBe('boolean');
    }
  });
});

describe('site config', () => {
  it('has a name', () => {
    expect(siteConfig.name.length).toBeGreaterThan(0);
  });

  it('has social links with valid urls', () => {
    expect(siteConfig.social.length).toBeGreaterThan(0);
    for (const { name, url } of siteConfig.social) {
      expect(name.length).toBeGreaterThan(0);
      expect(() => new URL(url)).not.toThrow();
    }
  });
});

describe('nav', () => {
  it('derives one nav link per app route', () => {
    expect(NAV_LINKS.map((l) => l.url)).toEqual(APP_ROUTES.map((r) => r.path));
  });
});
