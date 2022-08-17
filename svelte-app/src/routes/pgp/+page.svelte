<script lang="ts">
  import { page, navigating } from '$app/stores';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  import CodeBlock from '@/components/code-block.svelte';

  $: ({ pgp } = $page.data);
</script>

<div data-test-route="pgp" class={$navigating ? 'max-h-[50%]' : ''}>
  <PageHeading
    title="pgp"
    subtitle="Want to send a secure message my way? Here's my public PGP key"
  />
  <ContentWrapper>
    <CodeBlock content={`${pgp}`} showClipboard={true} />
  </ContentWrapper>
</div>
