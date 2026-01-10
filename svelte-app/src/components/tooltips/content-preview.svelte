<script lang="ts">
  import ErrorBoundary from '$components/error-boundary.svelte';
  import { BASE_DOMAIN } from '$lib/consts';
  import type { Snippet } from 'svelte';

  let { header, children }: { header?: string; children: Snippet } = $props();

  const scaleFac = 0.45;
  const inverseScaleFac = 1 / scaleFac;
</script>

<ErrorBoundary>
  <div
    class="pointer-events-none flex h-56 w-sm flex-col gap-y-3 overflow-hidden rounded-md bg-neutral-100 p-4 shadow-lg shadow-neutral-300/50 transition-colors select-none dark:bg-neutral-600"
  >
    {#if header}
      <span class="line-clamp-1 block w-full text-sm font-semibold opacity-70">
        {BASE_DOMAIN}&nbsp;/&nbsp;{header}
      </span>
    {/if}
    <div class="w-full flex-1 overflow-hidden rounded-md">
      <div
        class="bg-light dark:bg-dark h-screen px-6"
        style="transform: scale({scaleFac}); transform-origin: 0 0; width: calc(100% * {inverseScaleFac}"
      >
        {@render children()}
      </div>
    </div>
  </div>
</ErrorBoundary>
