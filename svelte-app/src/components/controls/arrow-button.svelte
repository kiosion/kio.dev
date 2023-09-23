<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher(),
    self = $$props.href ? 'a' : 'button',
    handleClick = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Enter') {
        return;
      }

      dispatch('click');
    };
</script>

<svelte:element
  this={self}
  href={$$props.href || undefined}
  class="inline-block font-code text-accent-light hover:text-dark focus-visible:text-dark dark:text-accent-dark dark:hover:text-light dark:focus-visible:text-light {$$props.class ||
    ''}"
  aria-label={$$props['aria-label'] || undefined}
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleClick}
  data-sveltekit-preload-code={$$props.preload ? 'hover' : 'off'}
  data-sveltekit-preload-data={$$props.preload ? 'hover' : 'off'}
>
  <slot />
</svelte:element>
