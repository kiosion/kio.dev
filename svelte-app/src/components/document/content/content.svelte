<script lang="ts">
  import Footer from '$components/document/content/footer.svelte';
  import Header from '$components/document/content/header.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import ConstrainWidth from '$components/layouts/constrain-width.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  import type { PostDocument, ProjectDocument, ProjectImage, RouteFetch } from '$types';

  export let data: PostDocument | ProjectDocument,
    images: ProjectImage[] | undefined = undefined,
    model = data._type,
    routeFetch: RouteFetch | undefined = undefined;
</script>

<Header {data} {images} {routeFetch} />
<ConstrainWidth class="px-6 pb-6 font-sans text-base md:px-10">
  {#if data.body}
    <PortableText text={data.body} {routeFetch} />
  {:else}
    <EmptyContent />
  {/if}
</ConstrainWidth>
<Footer {model} {data} />
