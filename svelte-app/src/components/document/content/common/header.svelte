<script lang="ts">
  import { formatDate, getReadingTime } from '$helpers/date';
  import { getTotalWords } from '$helpers/pt';
  import { currentLang, linkTo, t } from '$i18n';
  import { isMobile } from '$lib/helpers/responsive';

  import BulletPoint from '$components/bullet-point.svelte';
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import PostHeader from '$components/document/content/post/header.svelte';
  import ProjectHeader from '$components/document/content/project/header.svelte';
  import Icon from '$components/icon.svelte';

  import type { PostDocument, ProjectDocument, PTBlock } from '$types';

  export let data: PostDocument | ProjectDocument,
    model = data._type;

  const readingTime = getReadingTime(getTotalWords((data?.body ?? []) as PTBlock[]));

  $: date = formatDate(data.date, 'full', $currentLang);
</script>

<div data-test-id="{model}-header">
  <div class="flex flex-col">
    <svelte:component this={model === 'post' ? PostHeader : ProjectHeader}>
      <svelte:fragment slot="title">
        <h1>{data.title}</h1>
      </svelte:fragment>
      <svelte:fragment slot="meta">
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
          </div>
          <ArrowButton
            class="focusOutline-sm -mb-1 flex-1 whitespace-nowrap rounded-sm text-right"
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
      </svelte:fragment>
    </svelte:component>
  </div>
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
