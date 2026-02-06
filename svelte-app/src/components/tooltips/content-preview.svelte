<script lang="ts">
  import ErrorBoundary from '$components/error-boundary.svelte';
  import { BASE_DOMAIN } from '$lib/consts';
  import type { Snippet } from 'svelte';

  let { header, children }: { header?: string; children: Snippet } = $props();

  let frame = $state<HTMLDivElement>();
  let scale = $state(0.5);

  const VIRTUAL_W = 960;

  $effect(() => {
    if (!frame) {
      return;
    }

    const ro = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      scale = width / VIRTUAL_W;
    });

    ro.observe(frame);
    return () => ro.disconnect();
  });
</script>

<ErrorBoundary>
  <div
    class="pointer-events-none flex h-56 w-sm flex-col gap-y-3 overflow-hidden rounded-md bg-neutral-100/80 p-4 backdrop-blur-sm transition-colors select-none dark:bg-neutral-500/80"
    bind:this={frame}>
    {#if header}
      <span class="line-clamp-1 block w-full text-sm font-semibold opacity-70">
        {BASE_DOMAIN}&nbsp;/&nbsp;{header}
      </span>
    {/if}
    <div class="w-full flex-1 overflow-hidden rounded-md">
      <div
        class="bg-light dark:bg-dark -mt-1 h-screen px-8"
        style="
          width: {VIRTUAL_W}px;
          transform: scale({scale});
          transform-origin: 0 0;
        ">
        {@render children()}
      </div>
    </div>
  </div>
</ErrorBoundary>
