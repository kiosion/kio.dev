<script lang="ts">
  import { formatDate } from '$lib/date';
  import { linkTo, t } from '$lib/i18n';
  import { isMobile } from '$lib/responsive';
  import { parseViews } from '$lib/utils';

  import BulletPoint from '$components/bullet-point.svelte';
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Icon from '$components/icon.svelte';
  import Image from '$components/images/image.svelte';
  import ConstrainWidth from '$components/layouts/constrain-width.svelte';
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
  class="w-full border-b border-dark/80 px-6 pb-6 pt-7 dark:border-light/80 md:px-14"
  data-test-id="{model}-header"
>
  <h1
    class="h-fit max-w-full pb-4 text-4xl font-bold text-black transition-[color] dark:text-white lg:text-5xl lg:font-black"
  >
    {data.title}
  </h1>

  <div class="flex flex-row flex-wrap items-center justify-between gap-4">
    <div
      class="flex flex-row flex-wrap items-center justify-start gap-y-2 transition-[color]"
      aria-label={$t('{document} details', {
        document: model === 'post' ? 'Post' : 'Project'
      })}
      role="group"
    >
      <Tooltip text={$formatDate(data.date, 'days') ?? $t('Unknown date')}>
        <p class="cursor-default font-mono text-base" aria-label="Published date">
          {$formatDate(data.date, 'full') ?? $t('Unknown date')}
        </p>
      </Tooltip>
      <BulletPoint />
      <p class="cursor-default font-mono text-base">
        {$t('{length} min read', { length: data.estimatedReadingTime ?? 0 })}
      </p>
      <BulletPoint />
      <p class="cursor-default font-mono text-base">
        {$t('{views} views', { views: $parseViews((data.views ?? 0) + 1) })}
      </p>
      {#if data._type === 'project' && data.githubStars !== undefined && data.githubStars > 0}
        <BulletPoint />
        <p class="cursor-default font-mono text-base">
          {$t('{stars} stars', { stars: $parseViews(data.githubStars) })}
        </p>
      {/if}
    </div>
    <ArrowButton
      class="focus-outline-sm hidden flex-1 select-none whitespace-nowrap sm:block print:hidden"
      href={model === 'post' ? $linkTo('/thoughts') : $linkTo('/work')}
      align="right"
      fullWidth
      preload
    >
      <span class="flex items-center justify-end gap-2 text-base">
        {#key $isMobile}
          <Icon name="ArrowLeft" inline />
        {/key}
        <p>{$t('Read more')}</p>
      </span>
    </ArrowButton>
  </div>

  {#if data.tags?.length}
    <ConstrainWidth class="pt-5">
      <div
        class="flex flex-row flex-wrap items-center justify-start gap-2"
        aria-label={$t('Tags')}
      >
        <div class="pr-1">
          <Icon name="Label" size={20} />
        </div>

        {#each data.tags as tag}
          <span
            class="cursor-pointer select-none rounded-sm border border-dark/80 bg-dark/5 px-1.5 py-0.5 font-code text-sm transition-colors dark:border-light/80 dark:bg-light/5"
          >
            {tag.title.toLowerCase()}
          </span>
        {/each}
      </div>
    </ConstrainWidth>
  {/if}
</div>

{#if data._type === 'project' && data.github}
  <div
    class="flex w-full flex-row items-center justify-start gap-3 border-b border-dark/80 px-6 py-6 text-base dark:border-light/80 md:px-14"
  >
    <Icon name="GitCommit" />
    <span class="font-mono">
      <Link href={data.github}>
        {'github.com/' + data.github.split('github.com/')?.[1]}
      </Link>
    </span>
  </div>
{/if}

{#if data._type === 'project' && images?.length}
  <div class="w-full border-b border-dark/80 px-6 py-6 dark:border-light/80 md:px-14">
    {#if images.length > 1}
      <ImageCarousel {images} />
    {:else}
      <Image
        image={images[0].sanityAsset}
        placeholder={images[0].placeholder}
        crop={images[0].crop}
        srcPromise={images[0].asset}
        {routeFetch}
      />
    {/if}
  </div>
{/if}

<style lang="scss">
  h1 {
    overflow-wrap: break-word;
    word-break: break-word;
  }
</style>
