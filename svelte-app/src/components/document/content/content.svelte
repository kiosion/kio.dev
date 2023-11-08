<script lang="ts">
  import Divider from '$components/divider.svelte';
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

<Header {data} {images} />
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
