<script lang="ts">
  import { onMount } from 'svelte';
  import { parseEmoji } from '$helpers/emoji';

  let body: HTMLDivElement;

  onMount(() => parseEmoji(body));
</script>

<div class="mt-4 font-sans text-base" bind:this={body}>
  <slot />
</div>
