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

<div class="flex h-full w-full flex-col gap-y-5">
  <Header {data} {images} {routeFetch} />
  <div class="rounded-xl bg-neutral-100 pb-6 font-sans text-base dark:bg-neutral-600">
    {#if data.body}
      <PortableText text={data.body} {routeFetch} documentView />
    {:else}
      <EmptyContent />
    {/if}
  </div>
  <Footer {model} {data}></Footer>
</div>
