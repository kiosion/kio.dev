<script lang="ts">
  import icons from '$lib/icons';

  export let icon: string;
  export let hovered = false;
  export let width = 20;
  export let classes = '';
</script>

<div class="w-[{width}px] {classes}">
  {#await icons.get(icon) then svg}
    <svelte:component
      this={svg}
      {width}
      class="{hovered
        ? 'text-slate-600 dark:text-slate-300'
        : ''} transition-colors"
    />
  {/await}
</div>
