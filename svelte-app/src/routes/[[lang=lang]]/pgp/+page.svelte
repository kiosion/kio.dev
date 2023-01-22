<script lang="ts">
  import { page, navigating } from '$app/stores';
  import PageHeading from '$components/headings/page-heading.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import CodeBlock from '$components/code-block.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import { onMount } from 'svelte';
  import { t } from '$i18n';
  import type { PageData } from './$types';

  onMount(() => {
    navOptions.set({ down: '', up: '/about' });
    pageHeading.set('PGP');
  });

  export let data: PageData;
</script>

<div data-test-route="pgp" class={$navigating ? 'max-h-[50%]' : ''}>
  <ContentWrapper>
    <PageHeading
      heading="PGP"
      text={t('Want to send a secure message my way? Now you can :)')}
    />
    <CodeBlock
      content={`${data.pgp}`}
      showClipboard={true}
      showLineNumbers={false}
      lang="markdown"
    />
  </ContentWrapper>
</div>
