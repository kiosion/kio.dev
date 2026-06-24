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
  <div class="prose-links flex max-w-prose flex-col gap-3 text-lg">
    <AboutContent />
  </div>
</PageSection>

<div class="min-h-0 flex-1"></div>

<PageSection>
  <div>
    <div class="flex w-full flex-row items-center justify-start gap-3">
      <h2
        class="shrink-0 font-mono text-sm text-neutral-500 uppercase opacity-70 dark:text-neutral-200"
      >
        Recent posts
      </h2>
      <span class="h-px flex-1 bg-neutral-200 dark:bg-neutral-400"></span>
    </div>
    <PostList posts={data.posts} />
  </div>

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
