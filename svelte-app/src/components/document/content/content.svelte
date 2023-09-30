<script lang="ts">
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
<div class="mt-4 font-sans text-base">
  {#if data.body}
    <PortableText text={data.body} {routeFetch} />
  {:else}
    <EmptyContent />
  {/if}
</div>
<Footer {model} {data} />
