<script lang="ts">
  import { createEventDispatcher, setContext } from 'svelte';
  import { circIn, circOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  import { setState } from '$lib/helpers/menu';

  import { key } from './menu';

  export let x: number;
  export let y: number;

  let menuElement: HTMLElement;
  export let pageContainer: HTMLElement;
  const dispatch = createEventDispatcher();

  $: (() => {
    if (!menuElement) {
      return;
    }

    const rect = menuElement.getBoundingClientRect();
    const pageRect = pageContainer.getBoundingClientRect();

    x = Math.min(window.innerWidth - rect.width - 18, x);
    if (y > Math.min(window.innerHeight, pageRect.height + pageRect.top) - rect.height) {
      y -= rect.height;
    }
  })();

  setContext(key, {
    dispatchClick: () => dispatch('click')
  });

  const pageClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | undefined;
    if (target === menuElement || (target && menuElement.contains(target))) {
      return;
    }
    dispatch('clickoutside');
  };

  // TODO: Remove tab from here, need to properly handle passing focus for a11y!
  const handleKey = (e: KeyboardEvent) => {
    if (['Escape', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.code)) {
      return setState();
    }
  };
</script>

<svelte:body
  on:click={pageClick}
  on:mouseleave={() => setState()}
  on:keydown={(e) => handleKey(e)}
/>

<div
  style="top: {y}px; left: {x}px"
  in:blur={{ duration: 200, easing: circOut }}
  out:blur={{ duration: 200, easing: circIn }}
  bind:this={menuElement}
>
  <slot />
</div>

<style lang="scss">
  div {
    @apply fixed z-20 grid min-w-[14rem] overflow-hidden rounded-lg border border-dark/40 bg-light/50 py-2 text-dark backdrop-blur-md;
  }

  :global(.dark) {
    div {
      @apply border-light/40 bg-dark/50 text-light;
    }
  }
</style>
