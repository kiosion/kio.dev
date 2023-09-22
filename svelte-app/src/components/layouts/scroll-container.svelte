<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { navigating } from '$app/stores';

  import type { Navigation } from '@sveltejs/kit';
  import type { Unsubscriber } from 'svelte/store';

  export let element: HTMLDivElement;

  let unsubscribe: Unsubscriber,
    navState: Navigation | null = null;

  onMount(() => {
    unsubscribe ||= navigating.subscribe((state) => {
      state && (navState = state);

      if (state !== null) {
        return;
      }

      if (navState) {
        element.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  });

  onDestroy(() => unsubscribe?.());
</script>

<div
  class="relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll p-8"
  tabindex="-1"
  bind:this={element}
>
  <slot />
</div>
