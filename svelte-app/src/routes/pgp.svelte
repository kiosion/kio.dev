<script lang="ts" context="module">
  import CodeBlock from '@/components/code-block.svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    const now = performance.now();
    const res = await fetch('/api/pgp');
    const response = await res.json();
    const delta = performance.now() - now;
    delta < 200 &&
      (await new Promise((resolve) => setTimeout(resolve, 200 - delta)));
    return { props: { pgp: response.data } };
  };
</script>

<script lang="ts">
  import PageHeading from '@/components/headings/page-heading.svelte';

  export let pgp: string;
</script>

<div data-test-route="index" class="w-full">
  <PageHeading
    title="pgp"
    subtitle="Want to send a secure message my way? Here's my public PGP key"
  />
  <ContentWrapper>
    <CodeBlock content={`${pgp}`} showClipboard={true} />
  </ContentWrapper>
</div>
