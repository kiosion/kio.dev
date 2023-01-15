<script lang="ts">
  import { page, navigating } from '$app/stores';
  import PageHeading from '$components/headings/page-heading.svelte';
  import ContentWrapper from '$components/content-wrapper.svelte';
  import CodeBlock from '$components/code-block.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import { onMount, getContext } from 'svelte';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';
  import { t } from '$i18n';
  import type { PageData } from './$types';

  const getScrollContainer = getContext(
    'getScrollContainer'
  ) as () => HTMLDivElement | null;

  onMount(() => {
    navOptions.set({ down: '', up: '/about' });
    pageHeading.set('PGP');
    setTimeout(
      () => getScrollContainer()?.scrollTo({ top: 0, behavior: 'smooth' }),
      BASE_TRANSITION_DURATION - 50
    );
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
