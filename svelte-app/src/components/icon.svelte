<script lang="ts">
  import { t } from '$i18n';
  import icons from '$lib/icons';

  export let icon: string,
    hovered = false,
    inline = false,
    width = 20,
    height = width,
    style = '';
</script>

<div class="w-[{width}px] {inline ? 'inline' : ''} {$$props.class || ''}">
  {#await icons.get(icon) then svg}
    <svelte:component
      this={svg}
      {width}
      {height}
      class="{hovered ? 'text-gray-600 dark:text-gray-300' : ''} {inline ? 'inline' : ''}"
      aria-label={icon + $t(' icon')}
      {style}
    />
  {/await}
</div>
