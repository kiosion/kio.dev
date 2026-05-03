<script lang="ts">
  import Link from '$components/link.svelte';
  import PostList from '$components/new/post-list.svelte';

  let { data } = $props();
  let AboutContent = $derived(data.content.Component);
</script>

<section class="mt-8 flex w-full flex-col gap-8">
  <div
    class="font-display flex max-w-2xl flex-col gap-3 text-4xl font-semibold tracking-wide md:text-5xl">
    {#each data.content.title as line}
      <p>{line}</p>
    {/each}
  </div>
  <div class="flex max-w-prose flex-col gap-3 text-lg">
    <AboutContent />
  </div>
</section>

<div class="min-h-0 flex-1"></div>

<section class="flex flex-col gap-2">
  <span class="text-base tracking-wide opacity-70">Recent thoughts</span>

  {#if data.posts?.length}
    <PostList posts={data.posts} />
  {:else}
    <p class="text-md opacity-70">No posts yet.</p>
  {/if}

  <div class="flex flex-row items-center gap-2 text-base">
    <Link
      href="/thoughts/"
      data-sveltekit-preload-code="eager"
      data-sveltekit-preload-data="hover">
      See all
    </Link>
  </div>
</section>
