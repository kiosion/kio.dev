---
layout: post
title: MDsveX proof of concept
date: 2026-05-02
desc: A markdown-driven post demonstrating embedded Svelte components, drop-in for the existing Sanity-backed posts.
---

<script>
  import CodeBlock from '$components/code-block.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  const sampleCode = `type Greeting = \`Hello, \${string}\`;\n\nconst greet = (name: string): Greeting => \`Hello, \${name}\`;\n\nconsole.log(greet('world'));`;
</script>

This page is rendered from a single `.md` file in the repo. No CMS, no GROQ, no API roundtrip — the markdown is statically imported and compiled by Vite at build time.

## Why this matters

The existing `/thoughts/[slug]` route fetches a post from Sanity over the network on every request, then runs a portable-text renderer with a tree of custom serializers. This route does **none** of that. The same markdown source can:

- live alongside the code that renders it,
- get versioned in the same git history as the rest of the project,
- and embed first-class Svelte components inline.

## Embedded Svelte: a code block

The block below is the existing `<CodeBlock>` component, dropped straight into the markdown. The string is declared once in the `<script>` block at the top of this file to keep mdsvex's paragraph parser away from the multi-line content.

<CodeBlock filename="hello.ts" lang="ts" content={sampleCode} />

## Embedded Svelte: a tooltip

You can drop any component into the prose — for example, hovering <Tooltip content="This tooltip is rendered by the same component the rest of the site uses."><span class="underline decoration-orange-light decoration-2 underline-offset-[3px]">this phrase</span></Tooltip> shows the existing tooltip primitive without any portable-text annotation glue.

## What's lost vs the Sanity setup

- **No web editor.** You write posts in your editor, commit, deploy. Fine for a solo blog.
- **No draft preview UX.** Replaceable with branch deploys.
- **Image asset pipeline.** Sanity's image CDN goes away — replace with `static/` images, or keep a thin `@sanity/image-url` utility for legacy posts.

## What gets simpler

- The whole `sanity.queries.server.ts` / `sanity.server.ts` / portable-text serializer maze.
- `@sanity/client`, `@sanity/image-url`, `@portabletext/*` deps.
- Schema regen, dataset env split, Sanity Studio deploy.
- The `/api/get/*` indirection (already gone) and the `processHeadings` walk on every fetch.

The migration from Sanity is a one-time export script: GROQ posts to markdown files with frontmatter. Body conversion can be lossy for footnotes/highlights — those map cleanly to `<Footnote>` or `<mark>` Svelte components in markdown.

## A list, just to round out the styling

1. Frontmatter drives the title bar above (`title`, `date`, `desc`).
2. The wrapper layout is `src/components/markdown-post.svelte`.
3. mdsvex is wired up in `svelte.config.js` via `preprocess`, with `extensions: ['.md']`.
4. This file lives at `src/content/demo.md`, exposed through the `$content` alias.

> If this style holds up against the existing post pages, the rest of the migration is mostly mechanical.
