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

<div tabindex="-1" role="none" data-test-id="scroll-container" bind:this={element}>
  <slot {element} />
</div>

<style lang="scss">
  @import '@styles/mixins';

  div {
    @apply relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll p-8;
  }
</style>
