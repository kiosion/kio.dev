<script lang="ts">
  import { t } from '$i18n';
  import icons from '$lib/icons';

  import type { icons as iconsType } from '$lib/icons';

  // eslint-disable-next-line @typescript-eslint/ban-types
  export let icon: keyof typeof iconsType | (string & {}),
    hovered = false,
    inline = false,
    width = 20,
    height = width,
    style = '';

  const svg = icons.get(icon);
</script>

<div class="w-[{width}px] {inline ? 'inline' : ''} {$$props.class || ''}">
  <svelte:component
    this={svg}
    {width}
    {height}
    class="{hovered ? 'text-dark-600 dark:text-light-300' : ''} {inline ? 'inline' : ''}"
    aria-label={icon + $t(' icon')}
    {style}
    {$$restProps}
  />
</div>
