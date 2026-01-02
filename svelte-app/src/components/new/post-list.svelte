<script lang="ts">
  import type { GetPostsQueryResult } from '$types/sanity';

  const { posts }: { posts: NonNullable<GetPostsQueryResult> } = $props();
</script>

<ul
  class="mb-4 divide-y divide-neutral-300 border-y border-neutral-300 dark:divide-neutral-400 dark:border-neutral-400"
>
  {#each posts as post}
    <li>
      <a class="group block py-4" href={`/thoughts/${post.slug.current}`}>
        <div class="flex items-baseline justify-between gap-4">
          <h3
            class="group-hover:decoration-orange-light group-hover:dark:decoration-orange-dark font-semibold underline decoration-transparent decoration-2 underline-offset-4 transition-colors"
          >
            {post.title}
          </h3>
          <time class="text-sm whitespace-nowrap opacity-70">
            {new Date(post.date!).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: '2-digit'
            })}
          </time>
        </div>
        {#if post.desc}
          <p class="mt-1 text-sm opacity-70">{post.desc}</p>
        {/if}
      </a>
    </li>
  {/each}
</ul>
