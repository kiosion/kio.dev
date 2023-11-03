<script lang="ts">
  import { onDestroy } from 'svelte';

  import { afterNavigate } from '$app/navigation';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';

  export let element: HTMLDivElement;

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
      element.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }, BASE_TRANSITION_DURATION);
  });
</script>

<div tabindex="-1" role="none" data-test-id="scroll-container" bind:this={element}>
  <slot />
</div>

<style lang="scss">
  @import '@styles/mixins';

  div {
    @apply relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll p-8 pt-16 transition-[padding-top] duration-300;

    @include media(md) {
      @apply pt-24;
    }
  }
</style>
