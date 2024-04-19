<script lang="ts">
  import { formatDate } from '$lib/date';
  import { linkTo, t } from '$lib/i18n';
  import { parseViews } from '$lib/utils';

  import BulletPoint from '$components/bullet-point.svelte';
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Icon from '$components/icon.svelte';
  import Image from '$components/images/image.svelte';
  import Link from '$components/link.svelte';
  import ImageCarousel from '$components/portable-text/image-carousel.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  import type { PostDocument, ProjectDocument, ProjectImage, RouteFetch } from '$types';

  export let data: PostDocument | ProjectDocument,
    routeFetch: RouteFetch,
    images: ProjectImage[] | undefined = undefined,
    model = data._type;
</script>

<div
  class="w-full border-b border-dark/80 px-6 py-7 dark:border-light/60 md:px-10"
  data-test-id="{model}-header"
>
  <h1
    class="h-fit max-w-full pb-1 font-display text-5xl font-bold text-black transition-[color] dark:text-white"
  >
    {data.title}
  </h1>

  <div
    class="flex select-none flex-row flex-wrap items-center justify-between gap-5"
    class:pb-4={data.tags?.length}
  >
    <div
      class="flex flex-row flex-wrap items-center justify-start gap-x-1 gap-y-2 transition-[color]"
      aria-label={$t('{document} details', {
        document: model === 'post' ? 'Post' : 'Project'
      })}
      role="group"
    >
      <Tooltip text={$formatDate(data.date, 'days') ?? $t('Unknown date')}>
        <p class="cursor-default font-mono text-sm" aria-label="Published date">
          {$formatDate(data.date, 'full') ?? $t('Unknown date')}
        </p>
      </Tooltip>
      <BulletPoint></BulletPoint>
      <p class="cursor-default font-mono text-sm">
        {$t('{length} min read', { length: data.estimatedReadingTime ?? 0 })}
      </p>
      <BulletPoint></BulletPoint>
      <p class="cursor-default font-mono text-sm">
        {$t('{views} views', { views: $parseViews((data.views ?? 0) + 1) })}
      </p>
      {#if data._type === 'project' && data.githubStars !== undefined && data.githubStars > 0}
        <BulletPoint></BulletPoint>
        <p class="cursor-default font-mono text-sm">
          {$t('{stars} stars', { stars: $parseViews(data.githubStars) })}
        </p>
      {/if}
    </div>
    {#if !data.tags?.length}
      <ArrowButton
        class="focus-outline-sm hidden flex-1 select-none whitespace-nowrap sm:block print:hidden"
        href={model === 'post' ? $linkTo('/thoughts') : $linkTo('/work')}
        align="right"
        fullWidth
        preload
      >
        <span class="flex items-center justify-end gap-2 font-mono text-sm">
          <Icon name="ArrowLeft" inline></Icon>
          <p>{$t('Read more')}</p>
        </span>
      </ArrowButton>
    {/if}
  </div>

  {#if data.tags?.length}
    <div class="flex flex-wrap items-end justify-between">
      <div
        class="flex flex-row flex-wrap items-center justify-start gap-2"
        aria-label={$t('Tags')}
      >
        {#each data.tags as tag}
          <span
            class="cursor-pointer select-none rounded-sm border border-dark/80 bg-dark/5 px-1.5 py-1 font-mono text-xs transition-colors dark:border-light/60 dark:bg-light/5"
          >
            {tag.title.toLowerCase()}
          </span>
        {/each}
      </div>
      <ArrowButton
        class="focus-outline-sm hidden flex-1 select-none whitespace-nowrap sm:block print:hidden"
        href={model === 'post' ? $linkTo('/thoughts') : $linkTo('/work')}
        align="right"
        fullWidth
        preload
      >
        <span class="flex items-center justify-end gap-2 font-mono text-sm">
          <Icon name="ArrowLeft" inline></Icon>
          <p>{$t('Read more')}</p>
        </span>
      </ArrowButton>
    </div>
  {/if}
</div>

{#if data._type === 'project' && data.github}
  <div
    class="flex w-full flex-row items-center justify-start gap-3 border-b border-dark/80 px-6 py-6 text-base dark:border-light/60 md:px-10"
  >
    <Icon name="GitCommit"></Icon>
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

<style lang="scss">
  h1 {
    overflow-wrap: break-word;
    word-break: break-word;
  }
</style>
