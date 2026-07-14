<script lang="ts">
  import Link from '$components/link.svelte';
  import PageSection from '$components/page-section.svelte';
  import PageTitle from '$components/page-title.svelte';
  import PostList from '$components/post-list.svelte';

  let { data } = $props();
  let AboutContent = $derived(data.content.Component);
</script>

<!-- Fill viewport exactly. Height derived from the viewport so an
     outgoing page sharing the cell during transitions won't stretch it.
     Breakdown: header 3rem pad + 1.6875rem text-md line + 1px border;
     main py-10 5rem; footer 3rem pad + 1.125rem text-sm line + 1px border.
     Below sm the footer stacks to two rows + gap-y-6. -->
<div
  class="flex min-h-[calc(100dvh-16.4375rem-2px)] flex-col justify-between gap-18 sm:min-h-[calc(100dvh-13.8125rem-2px)]"
>
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

  <PageSection>
    <div>
      <PostList posts={data.posts} title="Recent posts" />
      <div class="border-t border-neutral-200 pt-4 text-base dark:border-neutral-400">
        <Link href="/thoughts/">See all posts</Link>
      </div>
    </div>
  </PageSection>
</div>
