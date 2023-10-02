<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { formatDate, getReadingTime } from '$helpers/date';
  import { getTotalWords } from '$helpers/pt';
  import { currentLang, t } from '$i18n';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  import BulletPoint from '$components/bullet-point.svelte';
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
  import Summary from '$components/document/content/common/summary.svelte';
  import PostHeader from '$components/document/content/post/header.svelte';
  import ProjectHeader from '$components/document/content/project/header.svelte';

  import type { DocumentHeadings, PostDocument, ProjectDocument, PTBlock } from '$types';

  export let data: PostDocument | ProjectDocument,
    model = data._type,
    headings: DocumentHeadings[] | undefined;

  const readingTime = getReadingTime(getTotalWords((data?.body ?? []) as PTBlock[]));

  let summaryExpanded = false;

  $: date = formatDate(data.date, 'full', $currentLang);
</script>

<div class="mb-4" data-test-id="{model}-header">
  <div class="flex flex-col">
    <svelte:component this={model === 'post' ? PostHeader : ProjectHeader}>
      <svelte:fragment slot="title">
        <h1
          class="my-4 h-fit w-fit font-display text-4xl font-bold text-black dark:text-white lg:mt-10 lg:text-6xl lg:font-black"
        >
          {data.title}
        </h1>
      </svelte:fragment>
      <svelte:fragment slot="meta">
        <div class="flex flex-row flex-wrap items-center justify-between gap-4">
          <div class="flex flex-row flex-wrap items-center justify-start gap-y-2">
            <p class="cursor-default font-mono text-base">
              {date ? date : $t('Unknown date')}
            </p>
            <BulletPoint />
            <p class="cursor-default font-mono text-base">
              {$t('{length} min read', { length: Math.floor(readingTime / 60) })}
            </p>
          </div>
          {#if headings?.length}
            <ArrowButton
              class="focusOutline-sm flex-1 whitespace-nowrap rounded-sm text-right"
              on:click={() => (summaryExpanded = !summaryExpanded)}
            >
              <span class="inline-block {summaryExpanded ? 'rotate-90' : '-rotate-90'}"
                >&larr;</span
              >
              {$t(summaryExpanded ? 'Hide Contents' : 'Show Contents')}
            </ArrowButton>
          {/if}
        </div>
      </svelte:fragment>
    </svelte:component>
  </div>
  {#if headings?.length && summaryExpanded}
    <div
      class="relative my-6 border-t border-dark/50 px-4 pt-4 dark:border-light/50"
      transition:slide={{
        duration: BASE_ANIMATION_DURATION + headings.length * 10,
        easing: cubicInOut
      }}
    >
      <Summary {headings} />
    </div>
  {/if}
  <Divider />
</div>
