<script lang="ts">
  import Footer from '$components/document/content/footer.svelte';
  import Header from '$components/document/content/header.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import type { RouteFetch } from '$types';
  import type { GetPostQueryResult } from '$types/sanity';

  export let data: NonNullable<GetPostQueryResult>,
    routeFetch: RouteFetch;
</script>

<div class="flex h-full w-full flex-col gap-y-5">
  <Header {data} />
  <div class="font-sans text-base">
    {#if data.body}
      <PortableText text={data.body} {routeFetch} documentView />
    {:else}
      <EmptyContent />
    {/if}
  </div>
</div>
