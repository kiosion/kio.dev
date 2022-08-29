<script lang="ts">
  import { onMount } from 'svelte';
  import type { PixelIcon } from '$lib/types';

  export let icon: () => Promise<PixelIcon>;
  let iconSvg: PixelIcon | undefined;

  onMount(async () => {
    iconSvg = await icon();
  });
</script>

<div class="w-[20px]">
  {#if iconSvg}
    <svelte:component this={iconSvg} width="20" />
  {/if}
</div>
