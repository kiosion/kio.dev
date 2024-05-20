<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { afterNavigate } from '$app/navigation';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';

  let element: HTMLDivElement, timeout: ReturnType<typeof setTimeout> | undefined;

  export let shadow = {
    top: false,
    bottom: false
  };

  const onScroll = (e?: Event) => {
    e && window.dispatchEvent(new CustomEvent('scroll', { detail: e }));

    if (!shadow) {
      return;
    }

    shadow.top = element.scrollTop > 10;
    shadow.bottom = element.scrollTop + element.clientHeight < element.scrollHeight - 10;
  };

  onMount(onScroll);

  onDestroy(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  afterNavigate(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      onScroll();
      element?.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }, BASE_TRANSITION_DURATION);
  });
</script>

<div
  class="relative mx-auto flex h-full w-full max-w-[76rem] flex-col rounded-sm border border-dark/80 bg-neutral-50 shadow-lg shadow-dark/10 transition-colors dark:border-light/60 dark:bg-black dark:shadow-black/40"
>
  <slot name="before" {shadow} />

  <div
    class="relative h-full flex-1 overflow-visible overflow-x-clip overflow-y-scroll"
    tabindex="-1"
    role="none"
    id="scroll-container"
    data-test-id="scroll-container"
    bind:this={element}
    on:scroll={onScroll}
    on:wheel={onScroll}
  >
    <slot {element} {shadow} />
  </div>

  <slot name="after" {shadow} />
</div>

<style lang="scss">
  @import '@styles/colors';
  @import '@styles/mixins';

  #scroll-container {
    scrollbar-color: $neutral-100 $white;

    @include dark {
      scrollbar-color: $neutral-400 $black;
    }
  }
</style>
