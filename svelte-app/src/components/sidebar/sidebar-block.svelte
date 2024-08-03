<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { circIn, circOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { linkTo, t } from '$lib/i18n';
  import { isDesktop } from '$lib/responsive';
  import { sidebarBlock } from '$lib/sidebar';

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

    scrollObserverUnsubscriber = sidebarBlock.subscribe((_) => {
      if (!scrollContainer) {
        return;
      }

      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('wheel', handleScroll);
      scrollContainer.addEventListener('scroll', handleScroll);
      scrollContainer.addEventListener('wheel', handleScroll);
    });
  });

  onDestroy(() => {
    scrollObserverUnsubscriber?.();
    scrollContainer?.removeEventListener('scroll', handleScroll);
    scrollContainer?.removeEventListener('wheel', handleScroll);
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

{#if $sidebarBlock && $isDesktop}
  <div
    class="order-3 flex flex-col rounded-xl bg-neutral-100 px-4 py-3 transition-colors dark:bg-neutral-600"
    in:blur={blurInOpts}
    out:blur={blurOutOpts}
  >
    <p class="cursor-default select-none text-base font-medium dark:text-neutral-300">
      {$t('Reading')}&nbsp;&mdash;&nbsp;{estRemainingTime}&nbsp;{$t(
        estRemainingTime === 1 ? 'min left' : 'mins left'
      )}
    </p>

    <p class="py-1 font-display text-xl font-bold">{title}</p>

    {#if tags?.length}
      <div class="flex flex-row flex-wrap items-center justify-start gap-2 py-1">
        {#each tags as tag}
          <a
            href={$linkTo(`/thoughts/+/${tag.slug.current}`)}
            class="flex w-fit flex-row items-center justify-start gap-x-2 whitespace-nowrap rounded-md bg-neutral-0/75 px-1.5 py-1 text-sm transition-colors hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
          >
            <span class="font-bold">#</span>
            <span>{tag.title.toLowerCase()}</span>
          </a>
        {/each}
      </div>
    {/if}

    {#if desc}
      <p class="line-clamp-5 p-1 text-base text-neutral-500 dark:text-neutral-300">
        {desc}
      </p>
    {/if}
  </div>
{/if}
