<script lang="ts">
  import { onDestroy } from 'svelte';

  import { afterNavigate } from '$app/navigation';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';

  export let element: HTMLDivElement | undefined = undefined;

  let timeout: ReturnType<typeof setTimeout> | undefined;

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
  bind:this={element}
  class="relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll p-8"
  data-test-id="scroll-container"
  role="none"
  tabindex="-1"
  on:scroll={(e) => {
    // dispatch what looks like a scroll event to the window
    window.dispatchEvent(new CustomEvent('scroll', { detail: e }));
  }}
>
  <slot {element} />
</div>
