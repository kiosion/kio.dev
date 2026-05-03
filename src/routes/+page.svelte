<script lang="ts">
  import Link from '$components/link.svelte';
  import PostList from '$components/new/post-list.svelte';

  let { data } = $props();
</script>

<section class="mt-8 flex w-full flex-row flex-wrap items-start justify-between gap-y-12">
  <div class="mr-auto flex flex-col gap-8">
    <div class="font-display flex max-w-2xl flex-col gap-2 text-4xl tracking-wide">
      <p>Hey, my name's Maxim.</p>
      <p>Security & infra engineer based in</p>
      <p>New York, NY.</p>
    </div>
    <p class="max-w-prose text-lg">
      I'm a self-taught engineer with over 15 years of experience in software and systems,
      currently focused on security and distributed infrastructure at enterprise scale.
      This site's where I write about programming, security, finance, or anything else
      that's captured my interest.
    </p>
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
