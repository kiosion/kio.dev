<script lang="ts">
  import { formatDate } from '$lib/date';
  import { linkTo, t } from '$lib/i18n';
  import { isMobile } from '$lib/responsive';
  import { parseViews } from '$lib/utils';

  import BulletPoint from '$components/bullet-point.svelte';
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
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

<div data-test-id="{model}-header">
  <h1
    class="mb-4 mt-10 h-fit max-w-full text-4xl font-bold text-black transition-[color] dark:text-white lg:mt-12 lg:text-6xl lg:font-black"
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
      class="focus-outline-sm -mb-1 hidden flex-1 select-none whitespace-nowrap sm:block print:hidden"
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
  {#if data._type === 'project' && (data.tags?.length || data.github)}
    <Divider />
    <div
      class="flex flex-row flex-wrap items-center justify-start gap-0.5 gap-y-3 text-base"
    >
      {#if data._type === 'project' && data.tags?.length}
        <div
          class="flex flex-row flex-wrap items-center justify-start gap-2"
          aria-label={$t('Tags')}
        >
          {#each data.tags as tag}
            <span
              class="cursor-default rounded-sm bg-dark/10 px-1.5 py-0.5 font-code text-sm transition-colors dark:bg-light/10"
            >
              {tag.title.toLowerCase()}
            </span>
          {/each}
        </div>
      {/if}
      {#if data.tags?.length && data._type === 'project' && data.github}
        <BulletPoint />
      {/if}
      {#if data._type === 'project' && data.github}
        <span class="font-mono">
          <Link href={data.github}>
            {'github.com/' + data.github.split('github.com/')?.[1]}
          </Link>
        </span>
      {/if}
    </div>
  {/if}

  {#if data._type === 'project' && images?.length}
    <Divider />
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
  {/if}
</div>
<Divider />

<style lang="scss">
  h1 {
    overflow-wrap: break-word;
    word-break: break-word;
  }
</style>
