<script lang="ts">
  import { icon as loadIcon } from '$stores/icons';

  export let icon: string;
  export let hovered = false;
</script>

<div class="w-[20px]">
  {#await loadIcon(icon) then svg}
    <svelte:component
      this={svg}
      width="20"
      class="{hovered
        ? 'text-slate-600 dark:text-slate-300'
        : ''} transition-colors"
    />
  {/await}
</div>
