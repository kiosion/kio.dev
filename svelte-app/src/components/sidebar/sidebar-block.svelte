<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { circIn, circOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { linkTo, t } from '$lib/i18n';
  import { isDesktop } from '$lib/responsive';
  import { sidebarBlock, sidebarHeadings } from '$lib/sidebar';

  import Divider from '$components/divider.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import SidebarHeadings from '$components/sidebar/sidebar-headings.svelte';

  import type { Unsubscriber } from 'svelte/store';

  export let scrollContainer: HTMLElement | null | undefined;

  const blurInOpts = {
      duration: BASE_ANIMATION_DURATION * 0.8,
      amount: 12,
      easing: circOut
    },
    blurOutOpts = {
      duration: BASE_ANIMATION_DURATION * 0.8,
      amount: 12,
      easing: circIn
    };

  let scrollObserverUnsubscriber: Unsubscriber | undefined,
    scrollProgress = 0,
    scrollProgressUpdateInterval: ReturnType<typeof setInterval> | undefined,
    handleScrollTimeout: ReturnType<typeof setTimeout> | undefined;

  const handleScroll = () => {
    if (handleScrollTimeout) {
      clearTimeout(handleScrollTimeout);
    }

    handleScrollTimeout = setTimeout(() => {
      if (!scrollContainer) {
        return;
      }

      const { scrollTop, clientHeight, scrollHeight } = scrollContainer;

      scrollProgress = Math.min(1, scrollTop / (scrollHeight - clientHeight));
    }, 250);
  };

  afterNavigate(() => {
    scrollProgress = 0;
  });

  onMount(() => {
    if (!scrollContainer || !browser) {
      return;
    }

    scrollObserverUnsubscriber = sidebarBlock.subscribe((_) => handleScroll());
    scrollProgressUpdateInterval = setInterval(() => handleScroll(), 1000);
  });

  onDestroy(() => {
    handleScrollTimeout && clearTimeout(handleScrollTimeout);
    scrollProgressUpdateInterval && clearInterval(scrollProgressUpdateInterval);

    scrollObserverUnsubscriber?.();
  });

  $: estRemainingTime = Math.round(
    Math.max(
      0,
      ($sidebarBlock?.estimatedReadingTime ?? 0) * Math.min(1, 1 - scrollProgress)
    )
  );
  $: ({ title, desc, tags } = $sidebarBlock ?? {
    title: undefined,
    desc: undefined,
    tags: undefined
  });
</script>

{#if $isDesktop && $sidebarBlock}
  <div class="order-3" in:blur={blurInOpts} out:blur={blurOutOpts}>
    <BaseContainer class="flex flex-col px-4 py-3">
      <p
        class="cursor-default select-none text-sm font-medium text-neutral-600 transition-colors dark:text-neutral-300"
      >
        {$t('Reading')}&nbsp;&mdash;&nbsp;{estRemainingTime}&nbsp;{$t(
          estRemainingTime === 1 ? 'min left' : 'mins left'
        )}
      </p>

      <p class="py-1 font-display text-xl font-bold leading-tight transition-colors">
        {title}
      </p>

      {#if tags?.length}
        <div class="flex flex-row flex-wrap items-center justify-start gap-2 pb-2 pt-1">
          {#each tags as tag}
            <a
              href={$linkTo(`/thoughts/+/${tag.slug.current}`)}
              class="focus-outline-sm flex w-fit flex-row items-center justify-start gap-x-2 whitespace-nowrap rounded-md bg-neutral-200/50 px-1.5 py-1 text-sm transition-colors hover:bg-neutral-200 focus-visible:bg-neutral-200 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
            >
              <span class="select-none font-bold">#</span>
              <span>{tag.title.toLowerCase()}</span>
            </a>
          {/each}
        </div>
      {/if}

      {#if desc}
        <p
          class="line-clamp-4 p-1 text-base text-neutral-600 transition-colors dark:text-neutral-100"
        >
          {desc}
        </p>
      {/if}

      {#if $sidebarHeadings}
        <div
          class="mt-3 select-none pb-1 text-sm font-medium text-neutral-600 transition-colors dark:text-neutral-300"
        >
          {$t('Summary')}
        </div>
        <div class="flex flex-col px-1.5">
          <SidebarHeadings headings={$sidebarHeadings} />
        </div>
      {/if}
    </BaseContainer>
  </div>
{/if}
