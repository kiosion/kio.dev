<script lang="ts">
  import { navigating } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';

  export let element: HTMLDivElement;

  let unsubscribe: Unsubscriber;

  onMount(() => {
    unsubscribe ||= navigating.subscribe((state) => {
      if (state !== null) {
        return;
      }
      element.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  onDestroy(() => unsubscribe?.());
</script>

<div
  class="relative h-full w-full overflow-x-clip overflow-y-scroll bg-stone-200 dark:bg-stone-800 rounded-t-3xl md:rounded-none p-8 overflow-visible transition-colors focusOutline"
  bind:this={element}
>
  <slot />
</div>
