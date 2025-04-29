<script lang="ts">
  import Footer from '$components/document/content/footer.svelte';
  import Header from '$components/document/content/header.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  import type { RouteFetch } from '$types';
  import type { HeadingNode, ProjectImage } from '$types/documents';
  import type { GetPostQueryResult, GetProjectQueryResult } from '$types/sanity';

  export let data: NonNullable<GetPostQueryResult | GetProjectQueryResult> & {
      headings: HeadingNode[];
    },
    images: ProjectImage[] | undefined = undefined,
    model = data._type,
    routeFetch: RouteFetch;
</script>

<div class="flex h-full w-full flex-col gap-y-5">
  <Header {data} {images} {routeFetch} />
  <BaseContainer class="pb-6 font-sans text-base">
    {#if data.body}
      <PortableText text={data.body} {routeFetch} documentView />
    {:else}
      <EmptyContent />
    {/if}
  </BaseContainer>
  <Footer {model} {data}></Footer>
</div>
