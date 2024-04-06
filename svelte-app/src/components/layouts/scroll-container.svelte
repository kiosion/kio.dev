<script lang="ts">
  import { onDestroy } from 'svelte';

  import { afterNavigate } from '$app/navigation';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';

  let element: HTMLDivElement, timeout: ReturnType<typeof setTimeout> | undefined;

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
      element?.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }, BASE_TRANSITION_DURATION);
  });
</script>

<div
  class="relative mx-auto flex h-full w-full max-w-[82rem] flex-col rounded-sm border border-dark/80 bg-white transition-colors dark:border-light/60 dark:bg-black"
>
  <slot name="before" />
  <div
    class="flex-1 overflow-visible overflow-x-clip overflow-y-scroll"
    tabindex="-1"
    role="none"
    data-test-id="scroll-container"
    bind:this={element}
    on:scroll={(e) => {
      // dispatch what looks like a scroll event to the window
      window.dispatchEvent(new CustomEvent('scroll', { detail: e }));
    }}
  >
    <slot {element} />
  </div>
  <slot name="after" />
</div>
