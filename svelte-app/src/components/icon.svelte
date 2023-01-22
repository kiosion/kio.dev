<script lang="ts">
  import icons from '$lib/icons';

  export let icon: string,
    hovered = false,
    inline = false,
    width = 20,
    height = width,
    classes = '',
    style = '';
</script>

<div class="w-[{width}px] {inline ? 'inline' : ''} {classes}">
  {#await icons.get(icon) then svg}
    <svelte:component
      this={svg}
      {width}
      {height}
      class="{hovered
        ? 'text-gray-600 dark:text-gray-300'
        : ''} transition-colors {inline ? 'inline' : ''}"
      {style}
    />
  {/await}
</div>
