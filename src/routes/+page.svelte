<script lang="ts">
  import Link from '$components/link.svelte';
  import PageSection from '$components/page-section.svelte';
  import PageTitle from '$components/page-title.svelte';
  import PostList from '$components/post-list.svelte';

  let { data } = $props();
  let AboutContent = $derived(data.content.Component);
</script>

<div class="flex min-h-[calc(100dvh-13rem)] flex-col gap-18">
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
      <PostList posts={data.posts} title="Recent posts" />
      <div class="border-t border-neutral-200 pt-4 text-base dark:border-neutral-400">
        <Link
          href="/thoughts/"
          data-sveltekit-preload-code="hover"
          data-sveltekit-preload-data="hover"
        >
          See all posts
        </Link>
      </div>
    </div>
  </PageSection>
</div>
