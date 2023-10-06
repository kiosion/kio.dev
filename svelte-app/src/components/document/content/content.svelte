<script lang="ts">
  import Divider from '$components/divider.svelte';
  import Footer from '$components/document/content/common/footer.svelte';
  import Header from '$components/document/content/common/header.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  import type {
    DocumentHeadings,
    PostDocument,
    ProjectDocument,
    RouteFetch
  } from '$types';

  export let data: PostDocument | ProjectDocument,
    model = data._type,
    headings: DocumentHeadings[] | undefined,
    routeFetch: RouteFetch | undefined = undefined;
</script>

<Header {data} {headings} />
<Divider />
<div>
  {#if data.body}
    <PortableText text={data.body} {routeFetch} />
  {:else}
    <EmptyContent />
  {/if}
</div>
<Divider />
<Footer {model} {data} />

<style lang="scss">
  div {
    @apply font-sans text-base;
  }
</style>
