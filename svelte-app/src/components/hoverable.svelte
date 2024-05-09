<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let hovered = false,
    setPointer = true;

  let debounce: ReturnType<typeof setTimeout> | undefined;

  const dispatch = createEventDispatcher(),
    handleHoverIn = () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        hovered = true;
        dispatch('update', { state: true });
      }, 0);
    },
    handleHoverOut = () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        hovered = false;
        dispatch('update', { state: false });
      }, 0);
    };

  onDestroy(handleHoverOut);
</script>

<span
  class="contents {$$props.class ?? ''}"
  class:cursor-pointer={setPointer}
  data-test-id="hover-target"
  on:mouseover={() => handleHoverIn()}
  on:mouseout={() => handleHoverOut()}
  on:focus={() => handleHoverIn()}
  on:focusin={() => handleHoverIn()}
  on:mouseenter={() => handleHoverIn()}
  on:mouseleave={() => handleHoverOut()}
  on:focusout={() => handleHoverOut()}
  on:blur={() => handleHoverOut()}
  role="none"
>
  <slot {hovered} />
</span>
