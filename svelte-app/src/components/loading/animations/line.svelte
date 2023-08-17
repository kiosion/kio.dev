<script lang="ts">
  export let theme = 'dark',
    width = '200px',
    height = '4px',
    transparent = false;
</script>

<div
  class="loading-line-wrapper"
  class:transparent
  style="width: {width}; height: {height};"
>
  <div data-test-id="loader-bar">
    {#each Array(7) as _}
      <div
        class="{theme === 'dark'
          ? 'bg-accent-dark shadow-accent-dark'
          : 'bg-accent-light shadow-accent-light'} shadow-[0_0_16px_var(--tw-shadow)]"
      />
    {/each}
  </div>
</div>
