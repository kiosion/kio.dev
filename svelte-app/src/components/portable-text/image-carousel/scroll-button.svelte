<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';

  export let dir: 'left' | 'right',
    onClick: () => void,
    disabled = false;
</script>

<Hoverable let:hovered>
  <button
    class="focus-outline mt-4 flex flex-grow items-center font-mono text-xs text-dark/90 disabled:cursor-not-allowed disabled:text-dark/60 dark:text-light/90 dark:disabled:text-light/60"
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
      class="-mx-2 -my-1.5 px-2 py-1.5"
      class:bg-neutral-100={hovered}
      class:dark:bg-neutral-500={hovered}
    >
      {#if dir === 'left'}
        [prev]
      {:else}
        [next]
      {/if}
    </span>
  </button>
</Hoverable>
