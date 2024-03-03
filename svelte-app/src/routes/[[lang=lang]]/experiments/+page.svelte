<script lang="ts">
  import { t } from '$lib/i18n.js';
  import { pageTitle } from '$lib/navigation';

  import ToruExperiment from '$components/experiments/toru.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';

  export let data;

  $: description = $t('pages.experiments.description');
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <meta itemprop="name" content={$pageTitle} />
  <meta itemprop="description" content={description} />
  <meta name="robots" content="index, follow" />
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={$pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:title" content={$pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

<HeadedBlock heading={$t('Experiments')}>
  <ToruExperiment initData={data.nowPlayingData} />
</HeadedBlock>
