<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { SvelteComponent } from 'svelte';

  const dispatch = createEventDispatcher<{
    click: MouseEvent | KeyboardEvent;
  }>();

  export let icon: typeof SvelteComponent<{}>,
    options: { label: string; value: string; selected: boolean }[];
</script>

<button
  class="focus-outline group flex h-10 flex-1 flex-row items-center rounded-lg py-0.5 pl-4 pr-0 text-sm"
  tabindex="0"
  on:click={(e) => dispatch('click', e)}
  on:keyup={(e) => e.key === 'Enter' && dispatch('click', e)}
  type="button"
  data-test-id={$$props['data-test-id']}
  aria-label={$$props['aria-label']}
>
  <svelte:component this={icon} />
  <div
    class="relative ml-2.5 mr-1.5 flex h-full w-full flex-1 flex-row items-center justify-around text-neutral-800 transition-colors dark:text-neutral-100"
  >
    <span class="peer/0 z-10 block flex-1" aria-selected={options[0].selected}>
      <span class="mx-auto block w-full">
        {options[0].label}
      </span>
    </span>
    <span class="peer/1 z-10 block flex-1" aria-selected={options[1].selected}>
      <span class="mx-auto block w-full">
        {options[1].label}
      </span>
    </span>
    <span
      class="absolute bottom-0 left-0 top-0 z-0 block w-1/2 rounded-md bg-neutral-0/75 transition-all group-hover:bg-neutral-0 group-focus:bg-neutral-0 peer-aria-selected/0:translate-x-0 peer-aria-selected/1:translate-x-full group-hover:peer-aria-selected/0:translate-x-full group-hover:peer-aria-selected/1:translate-x-0 group-focus:peer-aria-selected/0:translate-x-full group-focus:peer-aria-selected/1:translate-x-0 dark:bg-neutral-800 group-hover:dark:bg-neutral-800/75 group-focus:dark:bg-neutral-800/75"
    ></span>
  </div>
</button>
