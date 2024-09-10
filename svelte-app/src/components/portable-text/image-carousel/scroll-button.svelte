<script lang="ts">
  export let dir: 'left' | 'right',
    onClick: () => void,
    disabled = false;
</script>

<button
  class="focus-outline mt-4 flex flex-grow cursor-pointer items-center font-mono text-xs text-dark/90 disabled:cursor-not-allowed disabled:text-dark/60 dark:text-light/90 dark:disabled:text-light/60"
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
    class="-mx-2 -my-1.5 px-2 py-1.5 group-hover:bg-neutral-100 group-focus-visible:bg-neutral-100 group-hover:dark:bg-neutral-500 group-focus-visible:dark:bg-neutral-500"
  >
    {#if dir === 'left'}
      [prev]
    {:else}
      [next]
    {/if}
  </span>
</button>
