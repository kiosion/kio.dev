<script lang="ts">
  import Store from '$stores/cursor';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { get } from 'svelte/store';

  const dispatch = createEventDispatcher();

  let target: HTMLElement;
  export let classes = '';
  export let hovered = false;

  const handleHoverIn = () => {
    hovered = true;
    dispatch('update', { state: true });
    Store.update((s) => ({
      ...s,
      isHovered: true,
      currentTarget: target.firstChild
        ? (target.firstChild as HTMLElement)
        : target
    }));
  };

  const handleHoverOut = () => {
    hovered = false;
    dispatch('update', { state: false });
    Store.update((s) => ({
      ...s,
      isHovered: false,
      currentTarget: null
    }));
  };

  onDestroy(() => {
    hovered = false;
    if (
      get(Store).isHovered &&
      (target?.firstChild
        ? get(Store).currentTarget === target.firstChild
        : get(Store).currentTarget === target)
    ) {
      handleHoverOut();
    }
  });
</script>

<span
  class="contents {classes}"
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
