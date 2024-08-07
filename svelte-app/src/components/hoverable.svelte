<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  import { navigating } from '$app/stores';

  export let hovered = false,
    setPointer = true;

  let debounceOut: ReturnType<typeof setTimeout> | undefined,
    debounceIn: ReturnType<typeof setTimeout> | undefined;

  const dispatch = createEventDispatcher<{
      update: { state: boolean };
    }>(),
    handleHoverIn = () => {
      if (debounceIn) {
        clearTimeout(debounceIn);
      }
      debounceIn = setTimeout(() => {
        hovered = true;
        dispatch('update', { state: true });
      }, 10);
    },
    handleHoverOut = (e: Event & Partial<MouseEvent>) => {
      if (
        (e.relatedTarget !== null &&
          (e.currentTarget as HTMLElement | null)?.contains?.(e.relatedTarget as Node)) ||
        $navigating !== null
      ) {
        return;
      }

      if (debounceOut) {
        clearTimeout(debounceOut);
      }
      debounceOut = setTimeout(() => {
        hovered = false;
        dispatch('update', { state: false });
      }, 10);
    };

  onDestroy(() => {
    if (debounceIn) {
      clearTimeout(debounceIn);
    }
    if (debounceOut) {
      clearTimeout(debounceOut);
    }
  });
</script>

<span
  class="contents {$$props.class ?? ''}"
  class:cursor-pointer={setPointer}
  data-test-id="hover-target"
  on:mouseover={handleHoverIn}
  on:focus={handleHoverIn}
  on:focusin={handleHoverIn}
  on:mouseenter={handleHoverIn}
  on:mouseleave={handleHoverOut}
  on:focusout={handleHoverOut}
  on:blur={handleHoverOut}
  role="none"
>
  <slot {hovered} />
</span>
