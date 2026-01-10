<script lang="ts">
  import ErrorBoundary from '$components/error-boundary.svelte';
  import Link from '$components/link.svelte';
  import PostList from '$components/new/post-list.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import type {
    GetConfigQueryResult,
    GetPostsQueryResult,
  } from '$types/generated/sanity.types';

  let {
    config,
    posts,
  }: {
    config: NonNullable<GetConfigQueryResult>;
    posts: NonNullable<GetPostsQueryResult>;
  } = $props();
</script>

<div class="flex h-full min-w-full flex-grow flex-col gap-20">
  <section
    class="relative mt-10 flex w-full flex-row flex-wrap items-start justify-between gap-y-12"
  >
    <div class="mr-auto flex flex-col gap-8">
      <div class="font-display flex max-w-2xl flex-col gap-2 text-5xl tracking-wide">
        {#if config.hero}
          {#each config.hero.split('\n') as line, i}
            <p>{line}</p>
          {/each}
        {/if}
      </div>
      <p class="max-w-prose text-lg">
        {config.bio}
      </p>
    </div>
    <div
      class="text-md mt-4 ml-auto max-w-xs text-right text-neutral-600 dark:text-neutral-300"
    >
      {#if config.info}
        <ErrorBoundary>
          <PortableText text={config.info} class="leading-4" />
        </ErrorBoundary>
      {/if}
    </div>
  </section>

  <div class="min-h-0 flex-1"></div>

  <section class="flex flex-col gap-2">
    <span class="text-base tracking-wide opacity-70">Recent posts</span>

    {#if !posts.length}
      <p class="text-md opacity-70">No posts yet.</p>
    {:else}
      <PostList {posts} />
    {/if}

    <div class="flex flex-row items-center gap-2 text-base">
      <Link
        href="/thoughts/"
        data-sveltekit-preload-code="eager"
        data-sveltekit-preload-data="hover"
      >
        See all
      </Link>
    </div>
  </section>
</div>
