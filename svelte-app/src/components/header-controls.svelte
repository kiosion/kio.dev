<script lang="ts">
  import ThemeToggle from '@/components/toggles/theme-toggle.svelte';

  export let useThemeToggle = true;
  export let useControls = false;
  export let controlsContext = '';
</script>

<div class="hidden w-full md:flex justify-end items-center">
  <ThemeToggle />
</div>
