<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';
  import { isDesktop } from '$lib/helpers/responsive';
  import { shouldShowSummary, summaryVisible, visibleHeadings } from '$lib/summary';

  import Sidebar from '$components/document/content/common/sidebar.svelte';

  import type { Unsubscriber } from 'svelte/store';

  export let element: HTMLDivElement;

  let timeout: ReturnType<typeof setTimeout> | undefined,
    unsubscribe: Unsubscriber,
    sidebarElement: HTMLDivElement;

  onMount(
    () =>
      (unsubscribe = isDesktop.subscribe((state) => !state && summaryVisible.set(false)))
  );

  onDestroy(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    unsubscribe?.();
  });

  beforeNavigate(() => {
    summaryVisible.set(false);
    visibleHeadings.set(new Set());
  });

  afterNavigate(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      element.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }, BASE_TRANSITION_DURATION);
  });
</script>

<div
  class:split={$shouldShowSummary}
  tabindex="-1"
  role="none"
  data-test-id="scroll-container"
  bind:this={element}
>
  <slot />
  {#if $shouldShowSummary}
    <Sidebar bind:element={sidebarElement} />
  {/if}
</div>

<style lang="scss">
  @import '@styles/mixins';

  div {
    @apply relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll p-8 transition-[padding,grid-template-columns] duration-200;

    @include media(xl) {
      @apply duration-300;
    }

    @include media(lg) {
      @apply grid;

      grid-template-columns: 1fr minmax(0, 0fr);

      &.split {
        grid-template-columns: 1fr minmax(0, 0.5fr);
      }
    }
  }
</style>
