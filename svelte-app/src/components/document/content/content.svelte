<script lang="ts">
  import Wrapper from '$components/document/content/wrapper.svelte';
  import Header from '$components/document/content/common/header.svelte';
  import Footer from '$components/document/content/common/footer.svelte';
  import SummaryWrapper from '$components/document/content/common/summary/wrapper.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import type { PostDocument, ProjectDocument, ResData, Comment } from '$types';
  import type { Heading } from '$helpers/pt';

  export let model: 'post' | 'project',
    data: PostDocument | ProjectDocument,
    headings: Heading[] | undefined,
    comments: ResData<Comment[]> | undefined = undefined;
</script>

<Header {model} {data} />
{#if headings && headings.length > 0}
  <SummaryWrapper {headings} />
{/if}
<Wrapper>
  {#if data.body}
    <PortableText text={data.body} />
  {:else}
    <IconHeader
      icon={'Downasaur'}
      text="Hm, it seems empty around here..."
      classes="my-8"
    />
  {/if}
</Wrapper>
<Footer {model} {data} {comments} />
