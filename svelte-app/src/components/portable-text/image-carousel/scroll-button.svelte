<script lang="ts">
  import ChevronDoubleLeftSmall from '$components/icons/chevron-double-left-small.svelte';
  import ChevronDoubleRightSmall from '$components/icons/chevron-double-right-small.svelte';
  import ChevronLeftSmall from '$components/icons/chevron-left-small.svelte';
  import ChevronRightSmall from '$components/icons/chevron-right-small.svelte';

  export let dir: 'left' | 'right',
    onClick: () => void,
    disabled = false;
</script>

<button
  class="focus-outline group mt-4 flex flex-grow cursor-pointer items-center font-mono text-xs text-dark/90 transition-colors disabled:cursor-not-allowed disabled:text-dark/60 dark:text-light/90 dark:disabled:text-light/60"
  class:justify-end={dir === 'right'}
  class:justify-start={dir === 'left'}
  on:click={onClick}
  on:keydown={(e) => {
    if (e.key === 'Enter') {
      onClick();
    }
  }}
  type="button"
  {disabled}
>
  <span
    class="-mx-2 -my-1.5 rounded-sm px-2 py-1.5 transition-colors group-hover:bg-neutral-100 group-focus-visible:bg-neutral-100 group-hover:dark:bg-neutral-500 group-focus-visible:dark:bg-neutral-500"
  >
    {#if dir === 'left'}
      <span class="block group-hover:hidden group-focus-visible:hidden">
        <ChevronLeftSmall />
      </span>
      <span class="hidden group-hover:block group-focus-visible:block">
        <ChevronDoubleLeftSmall />
      </span>
    {:else}
      <span class="block group-hover:hidden group-focus-visible:hidden">
        <ChevronRightSmall />
      </span>
      <span class="hidden group-hover:block group-focus-visible:block">
        <ChevronDoubleRightSmall />
      </span>
    {/if}
  </span>
</button>
