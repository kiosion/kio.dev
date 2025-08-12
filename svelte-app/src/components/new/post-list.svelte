<script lang="ts">
    import type { GetPostsQueryResult } from "$types/sanity";

    const { posts }: { posts: NonNullable<GetPostsQueryResult> } = $props();
</script>

<ul class="divide-y divide-dark dark:divide-light border-t border-b border-dark dark:border-light mb-4">
  {#each posts as post}
    <li>
      <a class="block group py-4" href={`/thoughts/${post.slug.current}`}>
        <div class="flex items-baseline justify-between gap-4">
        <h3 class="font-semibold group-hover:underline group-hover:underline-offset-4 decoration-orange-light dark:decoration-orange-dark decoration-2">
          {post.title}
        </h3>
        <time class="text-sm opacity-70 whitespace-nowrap">
          {new Date(post.date!).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}
        </time>
        </div>
        {#if post.desc}
          <p class="mt-1 text-sm opacity-70">{post.desc}</p>
        {/if}
      </a>
    </li>
  {/each}
</ul>
