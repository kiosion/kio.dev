<script lang="ts">
  import { formatDate, getReadingTime } from '$helpers/date';
  import { getTotalWords } from '$helpers/pt';
  import { currentLang, linkTo, t } from '$i18n';
  import { isMobile } from '$lib/helpers/responsive';
  import { parseViews } from '$lib/views';

  import BulletPoint from '$components/bullet-point.svelte';
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
  import Icon from '$components/icon.svelte';
  import Link from '$components/link.svelte';
  import ImageCarousel from '$components/portable-text/image-carousel.svelte';

  import type { PostDocument, ProjectDocument, ProjectImage, PTBlock } from '$types';

  export let data: PostDocument | ProjectDocument,
    images: ProjectImage[] | undefined,
    model = data._type;

  const readingTime = getReadingTime(getTotalWords((data?.body ?? []) as PTBlock[]));

  $: date = formatDate(data.date, 'full', $currentLang);
</script>

<div data-test-id="{model}-header">
  <h1>{data.title}</h1>

  <div class="flex flex-row flex-wrap items-center justify-between gap-4">
    <div
      class="flex flex-row flex-wrap items-center justify-start gap-y-2 transition-[color]"
    >
      <p class="cursor-default font-mono text-base">
        {date ? date : $t('Unknown date')}
      </p>
      <BulletPoint />
      <p class="cursor-default font-mono text-base">
        {$t('{length} min read', { length: Math.floor(readingTime / 60) })}
      </p>
      <BulletPoint />
      <p class="cursor-default font-mono text-base">
        {$t('{views} views', { views: $parseViews(data.views) })}
      </p>
    </div>
    <ArrowButton
      class="focusOutline-sm -mb-1 hidden flex-1 whitespace-nowrap rounded-sm text-right sm:block"
      href={model === 'post' ? $linkTo('/blog') : $linkTo('/work')}
      preload
    >
      <span class="flex items-center justify-end gap-2 text-base">
        {#key $isMobile}
          <Icon icon={$isMobile ? 'ArrowUp' : 'ArrowLeft'} class="mb-0.5" inline />
        {/key}
        <p>{$t('Read more')}</p>
      </span>
    </ArrowButton>
  </div>
  {#if data._type === 'project' && (data.tags?.length || data.github)}
    <Divider />
    <div class="flex flex-row flex-wrap items-center justify-start gap-0.5 text-base">
      {#if data._type === 'project' && data.tags?.length}
        <div class="flex flex-row flex-wrap items-center justify-start gap-2">
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
            {'github/' + data.github.split('github.com/')?.[1]}
          </Link>
        </span>
      {/if}
    </div>
  {/if}

  {#if data._type === 'project' && images?.length}
    <Divider />
    <ImageCarousel {images} />
  {/if}
</div>

<style lang="scss">
  @import '@styles/mixins';

  h1 {
    @apply mb-4 mt-10 h-fit max-w-full font-display text-4xl font-bold text-black transition-[color];

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
