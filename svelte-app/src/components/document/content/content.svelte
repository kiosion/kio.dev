<script lang="ts">
  import Footer from '$components/document/content/footer.svelte';
  import Header from '$components/document/content/header.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  import type { PostDocument, ProjectDocument, ProjectImage, RouteFetch } from '$types';

  export let data: PostDocument | ProjectDocument,
    images: ProjectImage[] | undefined = undefined,
    model = data._type,
    routeFetch: RouteFetch | undefined = undefined;
</script>

<Header {data} {images} {routeFetch}></Header>
<div class="pb-6 font-sans text-base">
  {#if data.body}
    <PortableText text={data.body} {routeFetch} documentView></PortableText>
  {:else}
    <EmptyContent></EmptyContent>
  {/if}
</div>
<Footer {model} {data}></Footer>
