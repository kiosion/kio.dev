<script lang="ts">
  import Link from '$components/link.svelte';
  import PageSection from '$components/page-section.svelte';
  import PageTitle from '$components/page-title.svelte';
  import PostList from '$components/post-list.svelte';

  let { data } = $props();
  let AboutContent = $derived(data.content.Component);
</script>

<PageSection>
  <PageTitle class="gap-3">
    {#each data.content.title as line}
      <span>{line}</span>
    {/each}
  </PageTitle>
  <div class="flex max-w-prose flex-col gap-3 text-lg">
    <AboutContent />
  </div>
</PageSection>

<div class="min-h-0 flex-1"></div>

<PageSection>
  <h2 class="text-base tracking-wide opacity-70">Recent posts</h2>

  {#if data.posts?.length}
    <PostList posts={data.posts} />
  {:else}
    <p class="text-md opacity-70">No posts yet.</p>
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
</PageSection>
