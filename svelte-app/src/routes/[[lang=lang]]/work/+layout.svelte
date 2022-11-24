<script lang="ts">
  import PageHeading from '$components/headings/page-heading.svelte';
  import { t } from '$i18n';
  import { onMount, getContext } from 'svelte';
  import { BASE_TRANSITION_DURATION } from '$lib/consts';

  const getScrollContainer = getContext('getScrollContainer') as () =>
    | HTMLElement
    | undefined;

  onMount(() => {
    setTimeout(
      () => getScrollContainer()?.scrollTo({ top: 0, behavior: 'smooth' }),
      BASE_TRANSITION_DURATION - 50
    );
  });
</script>

<div data-test-route="work" class="w-full pb-20">
  <PageHeading
    heading={t('Work')}
    text={t(
      'A collection of my work, open-source contributions, and personal projects'
    )}
  />
  <slot />
</div>
