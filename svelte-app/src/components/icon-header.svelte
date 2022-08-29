<script lang="ts">
  import { onMount } from 'svelte';
  import type { PixelIcon } from '@/lib/types';

  export let text: string;
  export let icon: () => Promise<PixelIcon>;
  export let classes = 'mt-8 mb-2 w-full h-fit';

  let iconSvg: PixelIcon | undefined;

  onMount(async () => {
    iconSvg = await icon();
  });
</script>

<div class="flex flex-row justify-start items-center gap-3 {classes}">
  <div class="w-[20px]">
    {#if iconSvg}
      <svelte:component this={iconSvg} width="20" />
    {/if}
  </div>
  <h3 class="font-code text-lg">{text}</h3>
</div>
