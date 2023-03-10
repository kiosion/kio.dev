<script lang="ts">
  import { setContext, createEventDispatcher } from 'svelte';
  import { scale } from 'svelte/transition';
  import { key } from './menu';
  import { setState } from '$lib/helpers/menu';

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
    if (
      y >
      Math.min(window.innerHeight, pageRect.height + pageRect.top) - rect.height
    ) {
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
  in:scale={{ duration: 100, start: 0.98 }}
  out:scale={{ duration: 100, delay: 10, start: 0.98 }}
  bind:this={menuElement}
>
  <slot />
</div>

<style lang="scss">
  div {
    @apply fixed z-20 grid min-w-[14rem] overflow-hidden rounded-lg bg-stone-200 py-2 text-stone-900 shadow-[0_0_20px_-2px_var(--tw-shadow)] shadow-stone-500/50;
  }

  :global(.dark) {
    div {
      @apply bg-stone-700 text-stone-200 shadow-stone-500/40;
    }
  }
</style>
