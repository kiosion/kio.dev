<script lang="ts">
  import { page } from '$app/stores';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
</script>

<svelte:head>
  <title>kio.dev | {$page.status}</title>
</svelte:head>

<ContentWrapper>
  <PageHeading title="error {$page.status}" />
  <div class="flex w-full items-center justify-center">
    <code class="text-code text-base text-center"
      >{$page.error?.stack
        ? $page.error.stack
        : $page.error?.message
        ? $page.error.message
        : 'Something went wrong'}</code
    >
  </div>
</ContentWrapper>

<style lang="scss">
  code {
    overflow-wrap: anywhere;
  }
</style>
