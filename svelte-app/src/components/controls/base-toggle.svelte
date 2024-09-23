<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';

  import type { SvelteComponent } from 'svelte';

  const dispatch = createEventDispatcher<{
    click: MouseEvent | KeyboardEvent;
  }>();

  const duration = BASE_ANIMATION_DURATION * 0.5;

  // eslint-disable-next-line @typescript-eslint/ban-types
  export let icon: typeof SvelteComponent<{}>,
    options: { label: string; value: string; selected: boolean }[];
</script>

<Hoverable let:hovered>
  <button
    class="focus-outline flex h-10 flex-1 flex-row items-center rounded-lg bg-neutral-200/50 py-1.5 pl-4 pr-0 text-sm transition-colors hover:bg-neutral-200 focus-visible:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
    tabindex="0"
    on:click={(e) => dispatch('click', e)}
    on:keyup={(e) => e.key === 'Enter' && dispatch('click', e)}
    type="button"
    data-test-id={$$props['data-test-id']}
    aria-label={$$props['aria-label']}
  >
    <svelte:component this={icon} />
    <div
      class="relative mx-2.5 mb-px flex h-full w-full flex-1 text-neutral-800 dark:text-neutral-100"
    >
      {#if hovered}
        <span
          class="flex items-center justify-center text-center"
          in:fade={{
            duration,
            delay: duration / 2
          }}
          out:fade={{ duration }}
          >{$t('Switch to {opt}', { opt: options.find((o) => !o.selected)?.label })}</span
        >
      {:else}
        <span
          class="flex items-center justify-center text-center"
          in:fade={{
            duration,
            delay: duration / 2
          }}
          out:fade={{ duration }}>{options.find((o) => o.selected)?.label}</span
        >
      {/if}
    </div>
    <!-- <div
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
        class="absolute bottom-0 left-0 top-0 z-0 block w-1/2 rounded-md bg-neutral-200/50 transition-all group-hover:bg-neutral-200 group-focus:bg-neutral-200 peer-aria-selected/0:translate-x-0 peer-aria-selected/1:translate-x-full group-hover:peer-aria-selected/0:translate-x-full group-hover:peer-aria-selected/1:translate-x-0 dark:bg-neutral-800 group-hover:dark:bg-neutral-700 group-focus:dark:bg-neutral-700"
      ></span>
    </div> -->
  </button>
</Hoverable>

<style lang="scss">
  div {
    display: grid;

    span {
      grid-row: 1;
      grid-column: 1;
    }
  }
</style>
