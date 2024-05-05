<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { linkTo } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';

  const dispatch = createEventDispatcher<{ click: MouseEvent | KeyboardEvent }>();

  export let active = false,
    text = '',
    href: string;
</script>

<Hoverable let:hovered>
  <a
    class="focus-outline-sm text-dark/80 underline-offset-4 transition-colors dark:text-light/80"
    class:active={active || hovered}
    class:underline={active || hovered}
    class:slotted={$$slots.default !== undefined}
    class:flex={$$slots.default !== undefined}
    class:flex-row={$$slots.default !== undefined}
    class:items-center={$$slots.default !== undefined}
    class:justify-start={$$slots.default !== undefined}
    class:gap-x-1.5={$$slots.default !== undefined}
    class:dark:text-neutral-100={active || hovered}
    href={$linkTo(href)}
    tabindex="0"
    role={$$props.role || undefined}
    target={$$props.target || undefined}
    rel={$$props.rel || undefined}
    aria-current={active ? 'page' : undefined}
    aria-label={$$props['aria-label'] || text}
    data-sveltekit-preload-data
    data-sveltekit-preload-code
    on:click={(e) => dispatch('click', e)}
    on:keyup={(e) => e.code === 'Enter' && dispatch('click', e)}
  >
    {#if $$slots.default}
      <slot {hovered} />
    {:else}
      {text.toLowerCase()}
    {/if}
  </a>
</Hoverable>
