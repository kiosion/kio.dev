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

  import type { PostDocument, ProjectDocument, ProjectImage, RouteFetch } from '$types';

  export let data: PostDocument | ProjectDocument,
    routeFetch: RouteFetch,
    images: ProjectImage[] | undefined = undefined,
    model = data._type;
</script>

<div data-test-id="{model}-header">
  <h1>{data.title}</h1>

  <div class="flex flex-row flex-wrap items-center justify-between gap-4">
    <div
      class="flex flex-row flex-wrap items-center justify-start gap-y-2 transition-[color]"
    >
      <p class="cursor-default font-mono text-base">
        {$formatDate(data.date, 'full') ?? $t('Unknown date')}
      </p>
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
      class="focusOutline-sm -mb-1 hidden flex-1 whitespace-nowrap sm:block"
      href={model === 'post' ? $linkTo('/blog') : $linkTo('/work')}
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
              class="cursor-default rounded-sm bg-dark/10 px-1.5 py-0.5 font-code text-base transition-colors dark:bg-light/10"
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

<style lang="scss">
  @import '@styles/mixins';

  h1 {
    @apply mb-4 mt-10 h-fit max-w-full text-4xl font-bold text-black transition-[color];

    overflow-wrap: break-word;
    word-break: break-word;

    @include media(lg) {
      @apply mt-12 text-6xl font-black;
    }
  }

  :global(.dark) {
    h1 {
      @apply text-white;
    }
  }
</style>
