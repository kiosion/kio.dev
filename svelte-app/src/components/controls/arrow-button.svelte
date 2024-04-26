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

<Hoverable let:hovered>
  <svelte:element
    this={self}
    href={$$props.href || undefined}
    class:text-right={align === 'right'}
    class:text-left={align === 'left'}
    class="focus-outline-sm -mx-2 -my-1 inline-block select-none whitespace-nowrap rounded-xs py-1 font-mono text-sm hover:bg-neutral-light hover:text-orange-light focus-visible:bg-neutral-light dark:hover:bg-neutral-dark dark:focus-visible:bg-neutral-dark {$$props.class ??
      ''}"
    class:pr-2={placement === 'before'}
    class:pl-3={placement === 'before'}
    class:pr-3={placement === 'after'}
    class:pl-2={placement === 'after'}
    aria-label={$$props['aria-label'] || undefined}
    role="button"
    tabindex="0"
    on:click={handleClick}
    on:keydown={handleClick}
    data-sveltekit-preload-code={$$props.preload ? 'hover' : 'off'}
    data-sveltekit-preload-data={$$props.preload ? 'hover' : 'off'}
  >
    <div
      class="flex items-center gap-2"
      class:justify-start={align === 'left'}
      class:justify-end={align === 'right'}
    >
      {#if placement === 'after'}
        {#if $$slots.default}
          <slot />
        {:else}
          {text}
        {/if}
      {/if}
      <div
        class="mt-px transition-transform"
        class:-translate-x-1={hovered && dir === 'left'}
        class:translate-x-1={hovered && dir === 'right'}
      >
        {#if dir === 'left'}
          &larr;
        {:else if dir === 'right'}
          &rarr;
        {:else if dir === 'up'}
          &uarr;
        {:else if dir === 'down'}
          &darr;
        {/if}
      </div>
      {#if placement === 'before'}
        {#if $$slots.default}
          <slot />
        {:else}
          {text}
        {/if}
      {/if}
    </div>
  </svelte:element>
</Hoverable>
