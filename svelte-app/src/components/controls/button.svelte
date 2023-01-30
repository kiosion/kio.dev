<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import { goto } from '$app/navigation';
  import SFX from '$lib/sfx';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let type: 'a' | 'button' = 'a',
    href: string | undefined = undefined,
    action: ((e: MouseEvent) => void) | undefined = undefined,
    sfx = false,
    disabled = false,
    classNames = '';

  const onClick = (e: MouseEvent) => {
    dispatch('click', e);

    if (sfx) {
      SFX.click.play();
    }
    if (action) {
      action(e);
    }
  };

  let active = false;
</script>

<Hoverable bind:hovered={active}>
  {#if type === 'a'}
    <a
      class="{classNames} focusOutline"
      class:active
      class:disabled
      aria-disabled={disabled}
      {href}
      type="button"
      on:click={onClick}
    >
      <slot />
    </a>
  {:else}
    <button
      class="{classNames} focusOutline"
      class:active
      class:disabled
      aria-disabled={disabled}
      on:click={(e) => {
        onClick(e);
        href && goto(href);
      }}><slot /></button
    >
  {/if}
</Hoverable>

<style lang="scss">
  a,
  button {
    @apply rounded-md border border-stone-400 bg-violet-300/50 p-2 text-sm transition-colors ease-out;

    &.active {
      @apply border-violet-800 bg-violet-300 text-stone-900;
    }
    &.disabled {
      @apply cursor-not-allowed border-stone-400 bg-stone-400/40;
    }
  }

  :global(.dark) {
    a,
    button {
      @apply border-stone-400 bg-violet-400/40;

      &.active {
        @apply border-violet-200 bg-violet-400/80 text-stone-50;
      }
      &.disabled {
        @apply cursor-not-allowed border-stone-400 bg-stone-500/40;
      }
    }
  }
</style>
