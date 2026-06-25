<script lang="ts">
  import Link from '$components/link.svelte';
  import PageSection from '$components/page-section.svelte';
  import PageTitle from '$components/page-title.svelte';
  import PostList from '$components/post-list.svelte';

  let { data } = $props();
  let AboutContent = $derived(data.content.Component);
</script>

<!--
  The recent-posts list is pinned to the bottom via the flex spacer, but the
  spacer must fill a height that does NOT change during a page transition. The
  shared page wrapper stretches to the overlay grid cell, which grows to the
  incoming post's length — so we give this content its own fixed, viewport-based
  min-height (no flex-grow) and let the spacer fill THAT instead. Tune the rem
  offset (header + footer + main padding) if the list doesn't sit flush.
-->
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
    </div>

    <div class="flex flex-row items-center gap-2 text-base">
      <Link
        href="/thoughts/"
        data-sveltekit-preload-code="hover"
        data-sveltekit-preload-data="hover"
      >
        See all
      </Link>
    </div>
  </PageSection>
</div>
