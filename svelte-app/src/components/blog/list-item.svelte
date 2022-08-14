<script lang="ts">
  import type { Document } from '@/lib/types';
  import { getAbsDate, getReadingTime } from '$lib/helpers/date';
  import { getTotalWords } from '$lib/helpers/post';
  import BulletPoint from '../bullet-point.svelte';
  import type { TextBlock } from '$lib/types';
  import { highlightEffects } from '@/stores/features';

  export let post: Document;
  export let mousePos = [0, 0];

  $: [clientX, clientY] = mousePos;

  let glow: HTMLElement;
  let container: HTMLElement;
  let hovered: boolean;
  let readingTime = getReadingTime(
    getTotalWords(post.body as Array<TextBlock>)
  );

  const mouseMove = () => {
    if ($highlightEffects !== 'on') {
      return;
    }
    try {
      const { top, left } = container.getBoundingClientRect();
      glow.style && (glow.style.left = `${clientX - left}px`);
      glow.style && (glow.style.top = `${clientY - top}px`);
    } catch {
      () => undefined;
    }
  };

  $: clientX, clientY, mouseMove();
</script>

<div
  class="relative p-[1px] mt-6 overflow-hidden rounded-md {hovered
    ? 'active'
    : ''}"
  bind:this={container}
>
  {#if post}
    <a
      href="blog/{post.slug && post.slug.current}"
      on:mouseenter={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
    >
      <section
        class="flex flex-col items-stretch justify-stretch w-full h-fit max-h-32 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
        data-test-id="list-item"
      >
        <div
          class="cover absolute top-0 left-0 w-full h-full pointer-events-none block bg-slate-400 {hovered
            ? 'opacity-10'
            : 'opacity-0'}"
        />
        <h1
          class="block overflow-hidden whitespace-nowrap w-full text-ellipsis font-display font-bold text-lg"
        >
          {post.title}
        </h1>
        <div
          class="flex flex-row flex-wrap items-center justify-start w-full mt-2"
        >
          <h3 class="inline-block w-fit font-sans text-base">
            {getAbsDate(post.date)}
          </h3>
          <BulletPoint />
          <h3 class="inline-block w-fit font-sans text-base">
            {`${Math.floor(readingTime / 60)} min read`}
          </h3>
        </div>
        {#if post.desc}
          <p
            class="block overflow-hidden whitespace-nowrap w-full pr-6 text-ellipsis font-sans text-base mt-2 line-clamp-1"
          >
            {post.desc}
          </p>
        {/if}
      </section>
      {#if $highlightEffects === 'on'}
        <div bind:this={glow} class="absolute unfilled w-[800px] h-[800px]" />
      {/if}
      <div
        class="absolute filled top-[-4px] left-[-4px] w-[110%] h-[110%] bg-slate-400 {hovered
          ? '!opacity-60'
          : ''} opacity-0 rounded-md"
      />
      <div
        class="absolute top-[-4px] left-[-4px] w-[110%] h-[110%] bg-slate-200 dark:bg-slate-900 transition-colors duration-[120ms]"
      />
    </a>
  {:else}
    <section
      class="flex flex-col cursor-default items-stretch justify-stretch w-full h-32 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
      data-test-id="list-item"
    >
      <h3 class="text-center font-sans text-base my-2">No results found</h3>
    </section>
    {#if $highlightEffects === 'on'}
      <div bind:this={glow} class="absolute unfilled w-[800px] h-[800px]" />
    {/if}
    <div
      class="absolute top-[-4px] left-[-4px] w-[110%] h-[110%] bg-slate-200 dark:bg-slate-900"
    />
  {/if}
</div>

<style lang="scss">
  .filled {
    z-index: -2;
    + div {
      z-index: -3;
    }
  }
  .cover,
  .filled {
    transition: opacity 150ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .unfilled {
    z-index: -1;
    top: -9999px;
    left: -9999px;
    background: radial-gradient(#94a3b8, transparent 35%);
    transform: translate(-50%, -50%);
  }
</style>
