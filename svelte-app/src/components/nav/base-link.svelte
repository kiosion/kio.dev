<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { linkTo, t } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';

  const dispatch = createEventDispatcher<{ click: MouseEvent | KeyboardEvent }>();

  export let active = false,
    text = '',
    href: string,
    noTranslate = false;
</script>

<Hoverable let:hovered>
  <a
    class:active={active || hovered}
    class:slotted={$$slots.default !== undefined}
    href={$linkTo(href)}
    tabindex="0"
    role={$$props.role || undefined}
    target={$$props.target || undefined}
    rel={$$props.rel || undefined}
    aria-current={active ? 'page' : undefined}
    aria-label={$$props['aria-label'] || noTranslate ? text : $t(text)}
    data-sveltekit-preload-data
    data-sveltekit-preload-code
    on:click={(e) => dispatch('click', e)}
    on:keyup={(e) => e.code === 'Enter' && dispatch('click', e)}
  >
    {#if $$slots.default}
      <slot {hovered} />
    {:else}
      {noTranslate ? text.toLowerCase() : $t(text).toLowerCase()}
    {/if}
  </a>
</Hoverable>

<style lang="scss">
  @import '@styles/mixins';

  a {
    @apply rounded-sm text-sm text-dark/80;

    &.slotted {
      @apply flex flex-row items-center justify-start gap-x-1.5;
    }

    @include focused('.active') {
      @apply text-accent-light;

      @include dark {
        @apply text-accent-dark;
      }
    }

    @include focus-state(sm);

    @include dark {
      @apply text-light/80;
    }
  }
</style>
