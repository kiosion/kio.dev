<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let fullWidth = false,
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

<svelte:element
  this={self}
  href={$$props.href || undefined}
  class:fullWidth
  class:alignRight={align === 'right'}
  class:alignLeft={align === 'left'}
  class="arrowButton {$$props.class || ''}"
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

<style lang="scss">
  @import '@styles/mixins';

  .arrowButton {
    @apply inline-block rounded-sm font-code text-accent-light;

    @include focus-state(lg);

    &:hover,
    &:focus-visible {
      @apply text-light;
    }

    &.fullWidth {
      @apply w-full;
    }

    &.alignRight {
      @apply text-right;
    }

    &.alignLeft {
      @apply text-left;
    }
  }

  :global(.dark) {
    .arrowButton {
      @apply text-accent-dark;

      @include focus-state(lg, dark);

      &:hover,
      &:focus-visible {
        @apply text-light;
      }
    }
  }
</style>
