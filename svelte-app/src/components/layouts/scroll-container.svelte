<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';

  export let element: HTMLDivElement;

  let timeout: ReturnType<typeof setTimeout> | undefined;

  afterNavigate(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      element.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, BASE_TRANSITION_DURATION);
  });
</script>

<div tabindex="-1" role="none" bind:this={element}>
  <slot />
</div>

<style lang="scss">
  div {
    @apply relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll p-8;
  }
</style>
