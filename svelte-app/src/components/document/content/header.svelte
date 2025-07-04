<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { navigating } from '$app/state';
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { formatDate } from '$lib/date';
  import { currentLang, linkTo, t } from '$lib/i18n';
  import { sidebarBlock, sidebarHeadings } from '$lib/sidebar';
  import { parseViews } from '$lib/utils';
  import type { HeadingNode } from '$types/documents';
  import type { GetPostQueryResult } from '$types/sanity';

  export let data: NonNullable<GetPostQueryResult> & {
      headings: HeadingNode[];
    },
    model = data._type;

  let container: HTMLDivElement,
    observer: IntersectionObserver | undefined,
    sidebarTimeout: ReturnType<typeof setTimeout> | undefined;

  onMount(() => {
    if (!browser) {
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (sidebarTimeout) {
          clearTimeout(sidebarTimeout);
        }

        if (entry.isIntersecting || navigating.type) {
          sidebarTimeout = setTimeout(() => sidebarBlock.set(undefined), 250);
        } else {
          sidebarTimeout = setTimeout(() => sidebarBlock.set(data), 500);
        }
      });
    });

    observer.observe(container);
  });

  onDestroy(() => {
    observer?.disconnect();

    if (sidebarTimeout) {
      clearTimeout(sidebarTimeout);
    }

    sidebarBlock.set(undefined);
  });

  afterNavigate(() => {
    if (sidebarTimeout) {
      clearTimeout(sidebarTimeout);
    }

    sidebarBlock.set(undefined);
  });

  $: sidebarHeadings.set(data.headings?.length ? data.headings : undefined);
</script>

<BaseContainer
  class="flex w-full flex-row flex-wrap justify-between gap-2 p-2 text-sm text-neutral-700 dark:text-neutral-100"
>
  <div class="flex flex-row gap-2">
    <Tooltip content={$formatDate(data.date, 'rel') ?? $t('Unknown date')}>
      <p
        class="cursor-default rounded-lg bg-neutral-200/50 px-2.5 py-2 transition-colors dark:bg-neutral-700"
        aria-label="Published date"
      >
        {$formatDate(data.date, 'full') || $t('Unknown date')}
      </p>
    </Tooltip>
    <Tooltip
      content={$t('{length} words', {
        length: (data.estimatedWordCount ?? 0).toLocaleString($currentLang)
      })}
    >
      <p
        class="cursor-default rounded-lg bg-neutral-200/50 px-2.5 py-2 transition-colors dark:bg-neutral-700"
      >
        {$t('{length} min read', { length: data.estimatedReadingTime ?? 0 })}
      </p>
    </Tooltip>
    <p
      class="cursor-default rounded-lg bg-neutral-200/50 px-2.5 py-2 transition-colors dark:bg-neutral-700"
    >
      {$t('{views} views', { views: $parseViews((data.views ?? 0) + 1) })}
    </p>
  </div>
  <ArrowButton
    href={$linkTo(model === 'post' ? '/thoughts' : '/work')}
    dir="left"
    text={$t('All posts')}
    preload-code
    preload-data
  />
</BaseContainer>

<div
  class="rounded-xl border border-neutral-200/50 bg-neutral-100 p-2 transition-colors dark:border-neutral-500/90 dark:bg-neutral-600"
  data-test-id="{model}-header"
  bind:this={container}
>
  <div class="w-full px-4 py-2">
    <h1
      class="font-display h-fit max-w-full py-2 text-5xl leading-[1.1] font-bold text-black transition-[color] dark:text-white"
    >
      {data.title}
    </h1>
    {#if data.desc}
      <p class="pt-3 text-base text-neutral-700 dark:text-neutral-100">{data.desc}</p>
    {/if}
  </div>

  {#if data.tags?.length}
    <div
      class="flex flex-row flex-wrap items-center justify-start gap-3 p-2 text-sm"
      aria-label={$t('Tags')}
    >
      {#each data.tags as { slug, title }}
        <a
          class="focus-outline-sm flex flex-row gap-x-2 rounded-md bg-neutral-200/50 px-2.5 py-2 transition-colors select-none hover:bg-neutral-200 focus-visible:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
          href={$linkTo(`/thoughts/+/${slug.current}`)}
          data-sveltekit-preload-code
          aria-label={$t('Topic') + ': ' + title}
        >
          <span class="font-bold select-none">#</span>
          <span>{title.toLowerCase()}</span>
        </a>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  h1 {
    overflow-wrap: break-word;
    word-break: break-word;
  }
</style>
