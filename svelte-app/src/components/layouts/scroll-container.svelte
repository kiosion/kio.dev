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
  class="focusOutline relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll rounded-t-3xl bg-stone-200 p-8 transition-colors dark:bg-stone-800 md:rounded-none"
  bind:this={element}
>
  <slot />
</div>
