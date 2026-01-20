<script lang="ts">
  import LightBulb from '$components/icons/light-bulb.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { APP_THEMES } from '$lib/consts';
  import type { ThemeChoice } from '$lib/theme';

  let { theme, setTheme }: { theme: ThemeChoice; setTheme: (t: ThemeChoice) => void } =
    $props();
</script>

<Tooltip content={theme === APP_THEMES.DARK ? 'Lights on' : 'Lights off'}>
  <button
    type="button"
    class="group hover:text-orange-light hover:dark:text-orange-dark -m-2 w-fit cursor-pointer p-2 text-neutral-600 transition-colors dark:text-neutral-300"
    onclick={() =>
      setTheme(theme === APP_THEMES.DARK ? APP_THEMES.LIGHT : APP_THEMES.DARK)}>
    <LightBulb
      class="opacity-70 transition-all group-hover:opacity-100 group-focus-visible:opacity-100"
      fill={theme === APP_THEMES.DARK ? 'currentColor' : 'transparent'} />
  </button>
</Tooltip>
