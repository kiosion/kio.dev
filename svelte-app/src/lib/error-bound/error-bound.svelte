<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { Writable } from 'svelte/store';

  export let error: Writable<Error | undefined> | null = null;
  export let onError: ((arg0: unknown) => unknown) | null = null;

  let errorValue: Error | null = null;
  let message = 'Something went wrong...';
  let stack = '';
  let expanded = false;

  $: {
    if ($error && onError) {
      onError($error);
    }
  }
  $: $error, (errorValue = $error);
  $: stack = errorValue?.stack || 'Something went wrong...';
  $: message = errorValue?.message || '';
</script>

{#if $error}
  <div
    class="relative flex flex-col justify-start align-start py-4 px-5 border border-red-500 rounded-md"
    on:click={() => (expanded = !expanded)}
    on:keydown={(e) =>
      (e.code === 'Enter' || e.code === 'Space') && (expanded = !expanded)}
  >
    <h1 class="font-code font-bold text-lg">
      Component failed: <span class="font-normal">{message}</span>
    </h1>
    <p class="font-code text-base mt-2">Click to expand</p>
    {#if expanded}
      <code
        class="mt-4 mb-2 py-2 bg-gray-200 dark:bg-gray-900 rounded-sm overflow-scroll"
        in:slide={{ duration: 200 }}
        out:slide={{ duration: 200 }}
      >
        <pre class="text-base">
          {stack}
        </pre>
      </code>
    {/if}
  </div>
{:else}
  <slot />
{/if}
