<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { linkTo, t } from '$i18n';

  import Hoverable from '$components/hoverable.svelte';

  const dispatch = createEventDispatcher<{ click: MouseEvent | KeyboardEvent }>();

  export let active = false,
    text = '',
    href: string;
</script>

<Hoverable let:hovered>
  <a
    class:active={active || hovered}
    href={$linkTo(href)}
    tabindex="0"
    role={$$props.role || undefined}
    target={$$props.target || undefined}
    rel={$$props.rel || undefined}
    aria-current={active ? 'page' : undefined}
    aria-label={$$props['aria-label'] || $t(text)}
    data-sveltekit-preload-data
    data-sveltekit-preload-code
    on:click={(e) => dispatch('click', e)}
    on:keyup={(e) => {
      if (e.code === 'Enter') {
        dispatch('click', e);
      }
    }}
  >
    {#if $$slots.default}
      <slot {hovered} />
    {:else}
      {$t(text).toLowerCase()}
    {/if}
  </a>
</Hoverable>

<style lang="scss">
  @import '@styles/mixins';

  a {
    @apply rounded-sm text-sm text-dark/80;

    &:hover,
    &:focus-visible,
    &.active {
      @apply text-accent-light;
    }

    @include focus-state(sm);
  }

  :global(.dark) {
    a {
      @apply text-light/80;

      &:hover,
      &:focus-visible,
      &.active {
        @apply text-accent-dark;
      }

      @include focus-state(sm, dark);
    }
  }
</style>
