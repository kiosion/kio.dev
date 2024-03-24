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
    class="focus-outline-sm rounded-sm text-sm text-dark/80 dark:text-light/80"
    class:active={active || hovered}
    class:flex={$$slots.default !== undefined}
    class:flex-row={$$slots.default !== undefined}
    class:gap-x-1.5={$$slots.default !== undefined}
    class:items-center={$$slots.default !== undefined}
    class:justify-start={$$slots.default !== undefined}
    class:slotted={$$slots.default !== undefined}
    aria-current={active ? 'page' : undefined}
    aria-label={$$props['aria-label'] || noTranslate ? text : $t(text)}
    data-sveltekit-preload-code
    data-sveltekit-preload-data
    href={$linkTo(href)}
    rel={$$props.rel || undefined}
    role={$$props.role || undefined}
    tabindex="0"
    target={$$props.target || undefined}
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
    @include focused('.active') {
      @apply text-accent-light;

      @include dark {
        @apply text-accent-dark;
      }
    }
  }
</style>
