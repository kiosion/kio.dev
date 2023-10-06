<script lang="ts">
  import { formatDate, getReadingTime } from '$helpers/date';
  import { getTotalWords } from '$helpers/pt';
  import { isDesktop } from '$helpers/responsive';
  import { currentLang, t } from '$i18n';
  import { summaryContents, summaryVisible } from '$lib/summary';

  import BulletPoint from '$components/bullet-point.svelte';
  import ArrowButton from '$components/controls/arrow-button.svelte';
  import PostHeader from '$components/document/content/post/header.svelte';
  import ProjectHeader from '$components/document/content/project/header.svelte';
  import Icon from '$components/icon.svelte';

  import type { DocumentHeadings, PostDocument, ProjectDocument, PTBlock } from '$types';

  export let data: PostDocument | ProjectDocument,
    model = data._type,
    headings: DocumentHeadings[] | undefined;

  const readingTime = getReadingTime(getTotalWords((data?.body ?? []) as PTBlock[]));

  $: date = formatDate(data.date, 'full', $currentLang);
</script>

<div data-test-id="{model}-header">
  <div class="flex flex-col">
    <svelte:component this={model === 'post' ? PostHeader : ProjectHeader}>
      <svelte:fragment slot="title">
        <h1
          class="mb-4 mt-8 h-fit w-fit font-display text-4xl font-bold text-black transition-[color] dark:text-white lg:mt-10 lg:text-6xl lg:font-black"
        >
          {data.title}
        </h1>
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
          {#if $isDesktop && headings?.length}
            <ArrowButton
              class="focusOutline-sm -mb-1 flex-1 whitespace-nowrap rounded-sm text-right"
              on:click={() =>
                $isDesktop &&
                $summaryContents?.length &&
                summaryVisible.set(!$summaryVisible)}
            >
              <span class="flex items-center justify-end gap-2">
                {#key $summaryVisible}
                  <Icon
                    icon={$summaryVisible ? 'ArrowRight' : 'ArrowLeft'}
                    class="mb-0.5"
                    inline
                  />
                {/key}
                <p>{$t($summaryVisible ? 'Hide Sidebar' : 'Show Sidebar')}</p>
              </span>
            </ArrowButton>
          {/if}
        </div>
      </svelte:fragment>
    </svelte:component>
  </div>
</div>
