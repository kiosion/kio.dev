<script lang="ts">
  import Header from '$components/document/content/common/header.svelte';
  import Footer from '$components/document/content/common/footer.svelte';
  import SummaryWrapper from '$components/document/content/common/summary/wrapper.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import type {
    PostDocument,
    ProjectDocument,
    Comment,
    ResDataMany,
    ExternalUserInfo
  } from '$types';
  import type { Heading } from '$helpers/pt';

  export let model: 'post' | 'project',
    data: PostDocument | ProjectDocument,
    headings: Heading[] | undefined,
    userInfo: ExternalUserInfo | null = null,
    comments: ResDataMany<Comment> | undefined = undefined;
</script>

<Header {model} {data} />
{#if headings && headings.length > 0}
  <SummaryWrapper {headings} />
{/if}
<div class="mt-4 font-sans text-base">
  {#if data.body}
    <PortableText text={data.body} />
  {:else}
    <EmptyContent />
  {/if}
</div>
<Footer {model} {data} {userInfo} {comments} />
