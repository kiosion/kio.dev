---
layout: post
title: 'Testing: copy buttons & image zoom'
date: 2026-07-14
desc: A scratch post exercising code copy buttons, click-to-zoom images, and the reading progress bar.
tags: [meta]
---

<script>
  import Image from '$components/images/image.svelte';
</script>

This post exists to exercise a few new toys: the copy button that now sits on
every code block, click-to-zoom images via
[medium-zoom](https://github.com/francoischalifour/medium-zoom), and the
reading progress bar riding the header edge above. Scroll around, hover
things, click the image. Then delete me.

## Copy button

Hover a code block and a copy button fades in at its corner; clicking it
morphs the icon into a checkmark while the code lands on the clipboard:

```ts
export const greet = (name: string) => {
  return `Hello, ${name}`;
};
```

It works on any block, including ones long enough to scroll horizontally —
the button stays pinned to the block's corner:

```ts
const observer = new IntersectionObserver(reveal, {
  threshold: 0.4,
  rootMargin: '-100px',
});
```

## Image zoom

Click the screenshot — it should zoom in place over a theme-tinted overlay,
and un-zoom on click, scroll, or escape:

<Image
  src="/assets/img/8A566FF9-492B-4CB3-945B-2370F47CC856.png"
  alt="Screenshot of a custom scripted volume HUD over a desktop"
  caption="A borrowed screenshot, purely here to be zoomed."
/>

That's everything. This closing paragraph exists mostly so the page is long
enough for the progress bar to feel like it's measuring something.
