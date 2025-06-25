<script lang="ts">
  import ErrorBoundary from '$components/error-boundary.svelte';
  import type { Snippet } from 'svelte';

  const { children, class: className }: { children?: Snippet; class?: string } = $props();
</script>

<div
  class="rounded-xl border border-neutral-200/50 bg-neutral-100 transition-colors dark:border-neutral-500/90 dark:bg-neutral-600 {className ||
    ''}"
>
  <ErrorBoundary>
    {@render children?.()}
  </ErrorBoundary>
</div>
