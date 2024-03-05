<script lang="ts">
  import { onMount } from 'svelte';

  export let label: string,
    register: (element: HTMLElement) => void,
    active = false;

  let element: HTMLElement;

  onMount(() => {
    register?.(element);
  });
</script>

<div
  class="focus-outline-sm cursor-none select-none rounded-lg px-3 py-2 font-code text-base transition-colors active:text-accent-light/80 dark:active:text-accent-dark/80 {active
    ? 'text-accent-light dark:text-accent-dark'
    : ''}"
  data-cursor-target
  tabindex="0"
  role="button"
  bind:this={element}
>
  <span data-cursor-target-text>{label}</span>
</div>
