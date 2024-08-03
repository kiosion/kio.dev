<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Hoverable from '$components/hoverable.svelte';

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
</script>

<Hoverable>
  <svelte:element
    this={self}
    href={$$props.href || undefined}
    class:text-right={align === 'right'}
    class:text-left={align === 'left'}
    class="focus-outline-sm flex select-none flex-row gap-2 whitespace-nowrap rounded-lg bg-neutral-0/75 px-2.5 py-2 text-sm transition-all hover:gap-3 hover:bg-neutral-0 focus-visible:gap-3 focus-visible:bg-neutral-0 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 {$$props.class ??
      ''}"
    aria-label={$$props['aria-label'] || undefined}
    role="button"
    tabindex="0"
    on:click={handleClick}
    on:keydown={handleClick}
    data-sveltekit-preload-code={$$props.preload ? 'hover' : 'off'}
    data-sveltekit-preload-data={$$props.preload ? 'hover' : 'off'}
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
    <span>
      {#if dir === 'left'}
        &larr;
      {:else if dir === 'right'}
        &rarr;
      {:else if dir === 'up'}
        &uarr;
      {:else if dir === 'down'}
        &darr;
      {/if}
    </span>
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
</Hoverable>
