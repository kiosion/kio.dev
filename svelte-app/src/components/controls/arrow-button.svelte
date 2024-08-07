<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Hoverable from '$components/hoverable.svelte';

  // import ChevronDoubleDownSmall from '$components/icons/chevron-double-down-small.svelte';
  // import ChevronDoubleLeftSmall from '$components/icons/chevron-double-left-small.svelte';
  // import ChevronDoubleRightSmall from '$components/icons/chevron-double-right-small.svg';
  // import ChevronDoubleUpSmall from '$components/icons/chevron-double-up-small.svelte';
  // import ChevronDownSmall from '$components/icons/chevron-down-small.svelte';
  // import ChevronLeftSmall from '$components/icons/chevron-left-small.svelte';
  // import ChevronRightSmall from '$components/icons/chevron-right-small.svg';
  // import ChevronUpSmall from '$components/icons/chevron-up-small.svelte';

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
    class="focus-outline-sm flex select-none flex-row items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-neutral-0/75 px-2.5 py-2 text-sm transition-colors hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 {$$props.class ??
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

    <!--
      So... TLDR; Svelte has a *really* fun bug with component lifecycles during navigation.
      The two icon versions used for each `dir` here will *both* be mounted while this component
      (or its parent, I'm not quite sure) is being destroyed, *regardless* of the value of `hovered`.
      This is annoying as fuck because the only workaround I've found is just rawdogging the SVGs
      in here as normal elements.

      TODO: Look into this more / file an issue at some point... assuming it's not my own dumbass mistake somewhere.
    -->

    {#if dir === 'left'}
      <!-- <svelte:component this={hovered ? ChevronDoubleLeftSmall : ChevronLeftSmall} /> -->
      {#if hovered}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M3.22 7.595a.75.75 0 0 0 0 1.06l3.25 3.25a.75.75 0 0 0 1.06-1.06l-2.72-2.72 2.72-2.72a.75.75 0 0 0-1.06-1.06l-3.25 3.25Zm8.25-3.25-3.25 3.25a.75.75 0 0 0 0 1.06l3.25 3.25a.75.75 0 1 0 1.06-1.06l-2.72-2.72 2.72-2.72a.75.75 0 0 0-1.06-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
            clip-rule="evenodd"
          />
        </svg>
      {/if}
    {:else if dir === 'right'}
      <!-- <svelte:component this={hovered ? ChevronDoubleRightSmall : ChevronRightSmall} /> -->
      {#if hovered}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M12.78 7.595a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06l2.72-2.72-2.72-2.72a.75.75 0 0 1 1.06-1.06l3.25 3.25Zm-8.25-3.25 3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06l2.72-2.72-2.72-2.72a.75.75 0 0 1 1.06-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      {/if}
    {:else if dir === 'up'}
      <!-- <svelte:component this={hovered ? ChevronDoubleUpSmall : ChevronUpSmall} /> -->
      {#if hovered}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M7.47 3.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1-1.06 1.06L8 4.81 5.28 7.53a.75.75 0 0 1-1.06-1.06l3.25-3.25Zm-3.25 8.25 3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 1 1-1.06 1.06L8 9.81l-2.72 2.72a.75.75 0 0 1-1.06-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      {/if}
    {:else if dir === 'down'}
      <!-- <svelte:component this={hovered ? ChevronDoubleDownSmall : ChevronDownSmall} /> -->
      {#if hovered}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M7.47 12.78a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 11.19 5.28 8.47a.75.75 0 0 0-1.06 1.06l3.25 3.25ZM4.22 4.53l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 6.19 5.28 3.47a.75.75 0 0 0-1.06 1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      {/if}
    {/if}

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
