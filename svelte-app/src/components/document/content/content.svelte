<script lang="ts">
  import Divider from '$components/divider.svelte';
  import Footer from '$components/document/content/common/footer.svelte';
  import Header from '$components/document/content/common/header.svelte';
  import Summary from '$components/document/content/common/summary.svelte';
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
    routeFetch: RouteFetch | undefined = undefined,
    container: HTMLDivElement | undefined = undefined;
</script>

<Header {model} {data} />
{#if headings && headings.length > 0}
  <div>
    <Summary {headings} />
    <Divider />
  </div>
{/if}
<div class="mt-4 font-sans text-base" bind:this={container}>
  {#if data.body}
    <PortableText text={data.body} {routeFetch} />
  {:else}
    <EmptyContent />
  {/if}
</div>
<Footer {model} {data} />
