<script lang="ts">
  import Wrapper from '$components/document/content/wrapper.svelte';
  import Header from '$components/document/content/common/header.svelte';
  import Footer from '$components/document/content/common/footer.svelte';

  import PortableText from '$components/portable-text/portable-text.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import type { PostDocument, ProjectDocument } from '$lib/types';

  export let model: 'post' | 'project';
  export let data: PostDocument | ProjectDocument;
</script>

<Header {model} {data} />
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
<Footer {model} {data} />
