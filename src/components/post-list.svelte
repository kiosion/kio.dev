<script lang="ts">
  import EmptyContent from '$components/empty-content.svelte';
  import type { Post } from '$lib/content';
  import { listEnter, listExit, receive, send } from '$lib/transitions';

  const { posts, title }: { posts: Post[]; title?: string | number } = $props();

  const fmt = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
</script>

{#if title}
  <div class="flex w-full flex-row items-center justify-start gap-3">
    <h2
      class="shrink-0 font-mono text-sm tracking-wide text-neutral-500 uppercase opacity-70 dark:text-neutral-200"
    >
      [ {title} ]
    </h2>
    <span class="h-px flex-1 bg-neutral-200 dark:bg-neutral-400"></span>
  </div>
{/if}
{#if !posts?.length}
  <EmptyContent message="No posts found." />
{:else}
  <ul class="divide-y divide-neutral-200 dark:divide-neutral-400">
    {#each posts as post, idx (post.slug)}
      <li in:listEnter out:listExit>
        <a
          class="group block py-4 transition-opacity duration-100 active:opacity-60"
          href={`/thoughts/${post.slug}`}
        >
          <div class="flex items-baseline justify-between gap-4">
            <h3
              class="group-hover:decoration-orange-light group-hover:dark:decoration-orange-dark text-lg font-semibold underline decoration-transparent decoration-2 underline-offset-[3px] opacity-100 transition-[text-decoration-color,color,opacity] group-hover:opacity-80 group-focus-visible:opacity-80"
              out:send|global={{ key: `post-title-in-${post.slug}` }}
              in:receive|global={{ key: `post-title-out-${post.slug}` }}
            >
              {post.title}
            </h3>
            <time class="text-sm whitespace-nowrap tabular-nums opacity-70">
              {fmt.format(new Date(post.date!))}
            </time>
          </div>

          <p
            class="mt-1 line-clamp-1 max-w-4xl text-base opacity-70"
            out:send|global={{ key: `post-meta-in-${post.slug}` }}
            in:receive|global={{ key: `post-meta-out-${post.slug}` }}
          >
            {#if post.desc}
              {post.desc}
            {/if}
          </p>
        </a>
        <span
          class="h-full w-full bg-neutral-50 dark:bg-neutral-900"
          aria-hidden="true"
          out:send|global={{ key: `post-body-in-${post.slug}` }}
          in:receive|global={{ key: `post-body-out-${post.slug}` }}
        ></span>
      </li>
    {/each}
  </ul>
{/if}
