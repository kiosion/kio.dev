<script lang="ts" context="module">
  export const load: import('@sveltejs/kit').Load = async ({
    error,
    status
  }) => ({
    props: {
      error,
      status
    }
  });
</script>

<script lang="ts">
  import ContentWrapper from '@/components/content-wrapper.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import ReadMore from '@/components/read-more.svelte';

  export let error: Error, status: string;
</script>

<svelte:head>
  <title>kio.dev | {status}</title>
</svelte:head>

<ContentWrapper>
  <PageHeading title="error {status}" subtitle={error.message} />
  <ReadMore>
    <code class="text-code text-base">{error.stack}</code>
  </ReadMore>
</ContentWrapper>

<style lang="scss">
  code {
    overflow-wrap: anywhere;
  }
</style>
