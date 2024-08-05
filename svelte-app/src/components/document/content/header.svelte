<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { formatDate } from '$lib/date';
  import { currentLang, linkTo, t } from '$lib/i18n';
  import { sidebarBlock, sidebarHeadings } from '$lib/sidebar';
  import { parseViews } from '$lib/utils';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Image from '$components/images/image.svelte';
  import Link from '$components/link.svelte';
  import ImageCarousel from '$components/portable-text/image-carousel.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  import type { PostDocument, ProjectDocument, ProjectImage, RouteFetch } from '$types';

  export let data: PostDocument | ProjectDocument,
    routeFetch: RouteFetch,
    images: ProjectImage[] | undefined = undefined,
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
        if (entry.isIntersecting) {
          if (sidebarTimeout) {
            clearTimeout(sidebarTimeout);
          }

          sidebarTimeout = setTimeout(() => sidebarBlock.set(undefined), 250);
        } else {
          sidebarTimeout = setTimeout(() => sidebarBlock.set(data), 250);
        }
      });
    });

    observer.observe(container);

    if (data.headings?.length) {
      sidebarHeadings.set(data.headings);
    }
  });

  onDestroy(() => {
    observer?.disconnect();

    if (sidebarTimeout) {
      clearTimeout(sidebarTimeout);
    }

    sidebarBlock.set(undefined);
    sidebarHeadings.set(undefined);
  });

  afterNavigate(() => {
    if (sidebarTimeout) {
      clearTimeout(sidebarTimeout);
    }

    sidebarBlock.set(undefined);
    sidebarHeadings.set(undefined);
  });
</script>

<div
  class="flex w-full flex-row flex-wrap justify-between gap-2 rounded-xl bg-neutral-100 p-2 text-sm text-neutral-700 transition-colors dark:bg-neutral-600 dark:text-neutral-100"
>
  <div class="flex flex-row gap-2">
    <Tooltip text={$formatDate(data.date, 'days') ?? $t('Unknown date')}>
      <p
        class="cursor-default rounded-lg bg-neutral-0/75 px-2.5 py-2 transition-colors dark:bg-neutral-800/75"
        aria-label="Published date"
      >
        {$formatDate(data.date, 'full') ?? $t('Unknown date')}
      </p>
    </Tooltip>
    <Tooltip
      text={$t('{length} words', {
        length: (data.estimatedWordCount ?? 0).toLocaleString($currentLang)
      })}
    >
      <p
        class="cursor-default rounded-lg bg-neutral-0/75 px-2.5 py-2 transition-colors dark:bg-neutral-800/75"
      >
        {$t('{length} min read', { length: data.estimatedReadingTime ?? 0 })}
      </p>
    </Tooltip>
    <p
      class="cursor-default rounded-lg bg-neutral-0/75 px-2.5 py-2 transition-colors dark:bg-neutral-800/75"
    >
      {$t('{views} views', { views: $parseViews((data.views ?? 0) + 1) })}
    </p>
  </div>
  <ArrowButton
    href={$linkTo(model === 'post' ? '/thoughts' : '/work')}
    dir="left"
    text={$t('All posts')}
    preload
  />
</div>

<div
  class="rounded-xl bg-neutral-100 p-2 transition-colors dark:bg-neutral-600"
  data-test-id="{model}-header"
  bind:this={container}
>
  <div class="w-full px-4 py-2">
    <h1
      class="h-fit max-w-full py-2 font-display text-5xl font-bold leading-[1.1] text-black transition-[color] dark:text-white"
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
      {#each data.tags as tag}
        <a
          class="focus-outline-sm flex select-none flex-row gap-x-2 rounded-md bg-neutral-0/75 px-2.5 py-2 transition-colors hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
          href={$linkTo(
            `/${model === 'post' ? 'thoughts' : 'work'}/+/${tag.slug.current}`
          )}
          data-sveltekit-preload-code
          aria-label={$t('Topic') + ': ' + tag.title}
        >
          <span class="font-bold">#</span>
          <span>{tag.title.toLowerCase()}</span>
        </a>
      {/each}
    </div>
  {/if}

  {#if data._type === 'project' && data.github}
    <div
      class="flex w-full flex-row items-center justify-start gap-3 border-b border-dark/80 px-6 py-6 text-base dark:border-light/60 md:px-10"
    >
      <span
        class="cursor-default select-none font-mono text-sm text-dark/80 dark:text-light/80"
        >url /</span
      >
      <span class="font-mono text-sm">
        <Link href={data.github}>
          {'github.com/' + data.github.split('github.com/')?.[1]}
        </Link>
      </span>
    </div>
  {/if}

  {#if data._type === 'project' && images?.length}
    <div class="w-full border-b border-dark/80 px-6 py-6 dark:border-light/60 md:px-10">
      {#if images.length > 1}
        <ImageCarousel {images}></ImageCarousel>
      {:else}
        <Image
          image={images[0].sanityAsset}
          placeholder={images[0].placeholder}
          crop={images[0].crop}
          srcPromise={images[0].asset}
          {routeFetch}
        ></Image>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  h1 {
    overflow-wrap: break-word;
    word-break: break-word;
  }
</style>
