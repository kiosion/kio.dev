<script lang="ts">
  import { setContext, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
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
  class="fixed grid min-w-[14rem] py-2 z-20 shadow-gray-500/50 dark:shadow-gray-500/20 shadow-[0_0_20px_-2px_var(--tw-shadow)] bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden"
  style="top: {y}px; left: {x}px"
  in:fade={{ duration: 100 }}
  out:fade={{ duration: 100, delay: 10 }}
  bind:this={menuElement}
>
  <slot />
</div>
