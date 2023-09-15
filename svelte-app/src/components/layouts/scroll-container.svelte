<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { navigating } from '$app/stores';

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
  class="relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll rounded-t-2xl bg-light p-8 duration-150 dark:bg-black lg:rounded-t-none lg:bg-transparent"
  tabindex="-1"
  bind:this={element}
>
  <slot />
</div>
