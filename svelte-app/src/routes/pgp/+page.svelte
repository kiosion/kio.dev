<script lang="ts">
  import { page, navigating } from '$app/stores';
  import PageHeading from '$components/headings/page-heading.svelte';
  import ContentWrapper from '$components/content-wrapper.svelte';
  import CodeBlock from '$components/code-block.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    navOptions.set({ down: '', up: '/about' });
    pageHeading.set('PGP');
  });

  $: ({ pgp } = $page.data);
</script>

<div data-test-route="pgp" class={$navigating ? 'max-h-[50%]' : ''}>
  <ContentWrapper>
    <PageHeading
      heading="PGP"
      text="Want to send a secure message my way? Now you can :)"
    />
    <CodeBlock content={`${pgp}`} showClipboard={true} lang="markdown" />
  </ContentWrapper>
</div>
