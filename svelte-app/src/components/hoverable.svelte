<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let hovered = false,
    setPointer = true;

  const dispatch = createEventDispatcher(),
    handleHoverIn = () => {
      hovered = true;
      dispatch('update', { state: true });
    },
    handleHoverOut = () => {
      hovered = false;
      dispatch('update', { state: false });
    };

  onDestroy(handleHoverOut);
</script>

<span
  class={$$props.class}
  class:cursor-pointer={setPointer}
  data-test-id="hover-target"
  on:mouseover={() => handleHoverIn()}
  on:mouseout={() => handleHoverOut()}
  on:focus={() => (hovered = true)}
  on:focusin={() => (hovered = true)}
  on:focusout={() => (hovered = false)}
  on:blur={() => (hovered = false)}
  role="none"
>
  <slot />
</span>

<style lang="scss">
  span {
    @apply contents;
  }
</style>
