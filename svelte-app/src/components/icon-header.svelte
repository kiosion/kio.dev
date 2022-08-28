<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  export let text: string;
  export let icon: SvelteComponent | string;
  export let classes = 'mt-8 mb-2 w-full h-fit';
</script>

<div class="flex flex-row justify-start items-center gap-3 {classes}">
  <svelte:component this={icon} width="20" />
  <h3 class="font-code text-lg">{text}</h3>
</div>
