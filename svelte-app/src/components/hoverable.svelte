<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  const dispatch = createEventDispatcher();

  let target: HTMLElement;

  export let classes = '',
    hovered = false,
    setPointer = true;

  const handleHoverIn = () => {
    hovered = true;
    dispatch('update', { state: true });
  };

  const handleHoverOut = () => {
    hovered = false;
    dispatch('update', { state: false });
  };

  onDestroy(() => {
    handleHoverOut();
  });
</script>

<span
  class={classes}
  class:cursor-pointer={setPointer}
  data-test-id="hover-target"
  bind:this={target}
  on:mouseover={() => handleHoverIn()}
  on:mouseout={() => handleHoverOut()}
  on:focus={() => (hovered = true)}
  on:focusin={() => (hovered = true)}
  on:focusout={() => (hovered = false)}
  on:blur={() => (hovered = false)}
>
  <slot />
</span>

<style lang="scss">
  span {
    @apply contents;
  }
</style>
