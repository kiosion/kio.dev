<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    click: MouseEvent | KeyboardEvent;
  }>();

  type Option = {
    label: string;
    value: string;
    selected: boolean;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let icon: any, options: [Option, Option];
</script>

<button
  class="focus-outline group flex flex-1 flex-row items-center justify-center gap-x-3 rounded-lg bg-neutral-200/50 px-4 py-2.5 text-center text-sm text-neutral-800 transition-colors hover:bg-neutral-200 focus-visible:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
  tabindex="0"
  on:click={(e) => dispatch('click', e)}
  on:mouseup={(e) => {
    // move focus to prior element to prevent focus outline from being stuck
    e.currentTarget.blur();
  }}
  type="button"
  data-test-id={$$props['data-test-id']}
  aria-label={$$props['aria-label']}
>
  <svelte:component this={icon} />
  <span class="block group-hover:hidden group-focus-visible:hidden"
    >{options.find((option) => option.selected)?.label}</span
  >
  <span class="hidden group-hover:block group-focus-visible:block"
    >{options.find((option) => !option.selected)?.label}</span
  >
</button>
