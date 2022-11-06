<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import { getHeadings, type Heading } from '$helpers/pt';
  import type { PostDocument } from '$lib/types';
  import SidebarItems from '$components/blog/sidebar/items.svelte';

  export let post: PostDocument | undefined;
  export let show: boolean;

  let headings: Heading[] = [];
  let commentsHovered = false;

  $: if (post) {
    const { body } = post;
    if (body) {
      headings = getHeadings(JSON.parse(JSON.stringify(body)));
    }
  }
</script>

<div
  class="sticky self-start w-max top-24 h-fit {show
    ? 'mr-8'
    : 'mr-0'} transition-[margin]"
  aria-hidden={!show}
>
  <div
    class="relative flex flex-col gap-8 transition-[width,opacity] {show
      ? 'w-64 opacity-100'
      : 'w-0 opacity-0'} h-fit"
  >
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
          : 'bg-slate-200/50 dark:bg-slate-900/50'} transition-colors"
        role="button"
        aria-label="Leave a comment"
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
  </div>
</div>
