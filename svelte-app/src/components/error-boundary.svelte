<script lang="ts">
  import type { Snippet } from 'svelte';

  const {
    children,
    message = 'Something went wrong displaying this content.',
    showRetry = true,
    showError = false
  }: {
    children?: Snippet;
    message?: string;
    showRetry?: boolean;
    showError?: boolean;
  } = $props();
</script>

<svelte:boundary>
  {#snippet failed(error: unknown, reset: () => void)}
    <div
      class="my-2 flex flex-col items-center justify-center gap-4 text-center text-base text-neutral-700 dark:text-neutral-300"
    >
      <p>{message}</p>
      {#if showError && (error as Error)?.message}
        <p>
          Error message: {(error as Error).message}
        </p>
      {/if}
      {#if showRetry}
        <button
          class="focus-outline group flex w-fit cursor-pointer flex-row items-center justify-center gap-x-2 rounded-lg bg-neutral-200/50 px-2.5 py-2 text-sm transition-colors hover:bg-neutral-200 focus-visible:gap-3 focus-visible:bg-neutral-200 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
          onclick={reset}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="size-4 group-hover:hidden group-focus-visible:hidden"
          >
            <path
              fill-rule="evenodd"
              d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="hidden size-4 group-hover:block group-focus-visible:block"
          >
            <path
              fill-rule="evenodd"
              d="M8 3.5c-.771 0-1.537.022-2.297.066a1.124 1.124 0 0 0-1.058 1.028l-.018.214a.75.75 0 1 1-1.495-.12l.018-.221a2.624 2.624 0 0 1 2.467-2.399 41.628 41.628 0 0 1 4.766 0 2.624 2.624 0 0 1 2.467 2.399c.056.662.097 1.329.122 2l.748-.748a.75.75 0 1 1 1.06 1.06l-2 2.001a.75.75 0 0 1-1.061 0l-2-1.999a.75.75 0 0 1 1.061-1.06l.689.688a39.89 39.89 0 0 0-.114-1.815 1.124 1.124 0 0 0-1.058-1.028A40.138 40.138 0 0 0 8 3.5ZM3.22 7.22a.75.75 0 0 1 1.061 0l2 2a.75.75 0 1 1-1.06 1.06l-.69-.69c.025.61.062 1.214.114 1.816.048.56.496.996 1.058 1.028a40.112 40.112 0 0 0 4.594 0 1.124 1.124 0 0 0 1.058-1.028 39.2 39.2 0 0 0 .018-.219.75.75 0 1 1 1.495.12l-.018.226a2.624 2.624 0 0 1-2.467 2.399 41.648 41.648 0 0 1-4.766 0 2.624 2.624 0 0 1-2.467-2.399 41.395 41.395 0 0 1-.122-2l-.748.748A.75.75 0 1 1 1.22 9.22l2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          Retry
        </button>
      {/if}
    </div>
  {/snippet}
  {@render children?.()}
</svelte:boundary>
