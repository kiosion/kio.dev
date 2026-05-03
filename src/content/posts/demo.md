---
layout: post
title: MDsveX proof of concept
date: 2026-05-02
desc: A markdown-driven post that exercises fenced code blocks, embedded Svelte components, and the prose styling pipeline.
---

This page is rendered from a single `.md` file in the repo. mdsvex compiles
it into a Svelte component at build time. No CMS, no GROQ, no API roundtrip,
no client-side highlighter — fenced code blocks below are highlighted by
**shiki** during build and ship as static HTML with a dual-theme CSS-variable
palette.

## A code block

```ts
type Greeting = `Hello, ${string}`;

const greet = (name: string): Greeting => `Hello, ${name}`;

console.log(greet('world'));
```

## Why this matters

The previous setup fetched posts from Sanity over the network on every
request, ran a portable-text renderer with a tree of custom serializers, and
loaded a client-side syntax highlighter. This route does **none** of that.
The same markdown source can:

- live alongside the code that renders it,
- get versioned in the same git history as the rest of the project,
- and embed first-class Svelte components inline.

## A list, just to round out the styling

1. Frontmatter drives the title bar above (`title`, `date`, `desc`).
2. The wrapper layout is `src/components/markdown-post.svelte`.
3. mdsvex is wired up in `svelte.config.js` via `preprocess`, with
   `extensions: ['.md']`.
4. This file lives at `src/content/posts/demo.md`, exposed through the
   `$content` alias.

> External links like [the SvelteKit docs](https://svelte.dev/docs/kit) get
> `rel="nofollow noopener noreferrer"` and `target="_blank"` automatically via
> `rehype-external-links`. Internal links keep their default behavior.
