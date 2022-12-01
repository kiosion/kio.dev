<script lang="ts">
  import icons from '$lib/icons';

  export let icon: string,
    hovered = false,
    inline = false,
    width = 20,
    classes = '';
</script>

<div class="w-[{width}px] {inline ? 'inline' : ''} {classes}">
  {#await icons.get(icon) then svg}
    <svelte:component
      this={svg}
      {width}
      class="{hovered
        ? 'text-slate-600 dark:text-slate-300'
        : ''} transition-colors {inline ? 'inline' : ''}"
    />
  {/await}
</div>
