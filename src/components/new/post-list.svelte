<script lang="ts">
  import EmptyContent from '$components/empty-content.svelte';
  import type { Post } from '$lib/content';

  const { posts }: { posts: Post[] } = $props();

  const fmt = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
</script>

<div class="mb-4 border-y border-neutral-200 dark:border-neutral-400">
  {#if !posts?.length}
    <EmptyContent message="No posts found." />
  {:else}
    <ul class="divide-y divide-neutral-200 dark:divide-neutral-400">
      {#each posts as post, idx (post.slug)}
        <li>
          <a
            class="group block py-4"
            href={`/thoughts/${post.slug}`}
            data-sveltekit-preload-code="eager"
            data-sveltekit-preload-data="eager"
          >
            <div class="flex items-baseline justify-between gap-4">
              <h3
                class="group-hover:decoration-orange-light group-hover:dark:decoration-orange-dark font-semibold underline decoration-transparent decoration-2 underline-offset-[3px] opacity-100 transition-[text-decoration-color,color,opacity] group-hover:opacity-80 group-focus-visible:opacity-80"
              >
                {post.title}
              </h3>
              <time class="text-sm whitespace-nowrap opacity-70">
                {fmt.format(new Date(post.date!))}
              </time>
            </div>

            {#if post.desc}
              <p class="mt-1 line-clamp-1 max-w-4xl text-base opacity-70">
                {post.desc}
              </p>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>
