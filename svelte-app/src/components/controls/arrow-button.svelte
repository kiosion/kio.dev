<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import ChevronDoubleDownSmall from '$components/icons/chevron-double-down-small.svelte';
  import ChevronDoubleLeftSmall from '$components/icons/chevron-double-left-small.svelte';
  import ChevronDoubleRightSmall from '$components/icons/chevron-double-right-small.svelte';
  import ChevronDoubleUpSmall from '$components/icons/chevron-double-up-small.svelte';
  import ChevronDownSmall from '$components/icons/chevron-down-small.svelte';
  import ChevronLeftSmall from '$components/icons/chevron-left-small.svelte';
  import ChevronRightSmall from '$components/icons/chevron-right-small.svelte';
  import ChevronUpSmall from '$components/icons/chevron-up-small.svelte';

  export let text: string,
    placement: 'before' | 'after' = 'before',
    dir: 'left' | 'right' | 'up' | 'down' = 'right',
    align: 'left' | 'right' = 'left';

  const dispatch = createEventDispatcher(),
    self = $$props.href ? 'a' : 'button',
    handleClick = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Enter') {
        return;
      }

      dispatch('click');
    };

  $: [StandardArrow, FocusArrow] = {
    left: [ChevronLeftSmall, ChevronDoubleLeftSmall],
    right: [ChevronRightSmall, ChevronDoubleRightSmall],
    up: [ChevronUpSmall, ChevronDoubleUpSmall],
    down: [ChevronDownSmall, ChevronDoubleDownSmall]
  }[dir];
</script>

<svelte:element
  this={self}
  href={$$props.href || undefined}
  class:text-right={align === 'right'}
  class:text-left={align === 'left'}
  class="focus-outline-sm group flex cursor-pointer select-none flex-row items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-neutral-200/75 px-2.5 py-2 text-sm transition-colors hover:bg-neutral-200 focus-visible:bg-neutral-200 disabled:cursor-not-allowed dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 {$$props.class ??
    ''}"
  aria-label={$$props['aria-label'] || undefined}
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleClick}
  data-sveltekit-preload-code={$$props['preload-code'] ? 'hover' : 'off'}
  data-sveltekit-preload-data={$$props['preload-data'] ? 'hover' : 'off'}
>
  {#if placement === 'after'}
    <span>
      {#if $$slots.default}
        <slot />
      {:else}
        {text}
      {/if}
    </span>
  {/if}

  <StandardArrow class="block group-hover:hidden group-focus:hidden" />
  <FocusArrow class="hidden group-hover:block group-focus:block" />

  {#if placement === 'before'}
    <span>
      {#if $$slots.default}
        <slot />
      {:else}
        {text}
      {/if}
    </span>
  {/if}
</svelte:element>
