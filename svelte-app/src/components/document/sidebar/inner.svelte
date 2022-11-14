<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import SidebarItems from '$components/document/sidebar/items.svelte';
  import type { Heading } from '$helpers/pt';

  let commentsHovered = false;

  export let headings: Heading[];
</script>

<!-- Layout -->
{#if headings.length > 0}
  <div
    class="w-full px-3 py-5 overflow-hidden transition-colors rounded-md h-fit bg-slate-200/50 dark:bg-slate-900/50"
  >
    <SidebarItems {headings} />
  </div>
{/if}
<!-- Leave a comment -->
<Hoverable bind:hovered={commentsHovered}>
  <div
    class="w-full px-5 py-5 rounded-md h-fit {commentsHovered
      ? 'bg-slate-300/50 dark:bg-slate-700/50'
      : 'bg-slate-200/50 dark:bg-slate-900/50'} transition-colors cursor-default select-none"
    role="button"
    aria-label="Leave a comment"
    aria-disabled="true"
    tabindex="0"
    on:click={() => undefined}
    on:keydown={(e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        undefined;
      }
    }}
  >
    <div class="flex flex-row items-center justify-between w-full">
      <p
        class="text-sm font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap"
      >
        Leave a comment...
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </div>
  </div>
</Hoverable>
