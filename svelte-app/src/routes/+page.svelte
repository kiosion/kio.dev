<script lang="ts">
  import PostList from '$components/new/post-list.svelte';

  const { data } = $props();
</script>

<div class="flex h-full min-w-full flex-grow flex-col gap-20">
  <section
    class="relative mt-10 flex w-full flex-row flex-wrap items-start justify-between gap-y-12"
  >
    <div class="mr-auto flex flex-col gap-8">
      <div class="font-display flex max-w-2xl flex-col gap-2 text-5xl tracking-wide">
        {#if data.config.hero}
          {#each data.config.hero.split('\n') as line, i}
            <p>{line}</p>
          {/each}
        {/if}
      </div>
      <p class="max-w-prose text-lg">
        {data.config.bio}
      </p>
    </div>
    <div class="text-md ml-auto flex max-w-xs flex-col gap-4 text-right opacity-70">
      {#if data.config.info}
        {#each data.config.info as bullet}
          <p>{bullet}</p>
        {/each}
      {/if}
    </div>
  </section>

  <div class="min-h-0 flex-1"></div>

  <section class="flex flex-col gap-2">
    <span class="text-base tracking-wide opacity-70">Recent posts</span>

    {#if !data.posts.length}
      <p class="text-md opacity-70">No posts yet.</p>
    {:else}
      <PostList posts={data.posts} />
    {/if}

    <div class="flex flex-row items-center gap-2 text-base">
      <a
        href="/thoughts"
        class="hover:decoration-orange-light hover:dark:decoration-orange-dark underline decoration-neutral-200 decoration-2 underline-offset-[3px] transition-colors dark:decoration-neutral-400"
        data-sveltekit-preload-code="eager"
        data-sveltekit-preload-data="hover">See all</a
      >
    </div>
  </section>
</div>
