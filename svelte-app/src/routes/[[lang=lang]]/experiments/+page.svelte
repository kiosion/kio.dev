<script lang="ts">
  import { t } from '$lib/i18n.js';
  import { pageTitle } from '$lib/navigation';

  import Divider from '$components/divider.svelte';
  import GameOfLifeExperiment from '$components/experiments/gol.svelte';
  import MagneticCursorExperiment from '$components/experiments/mag-cursor.svelte';
  import ToruExperiment from '$components/experiments/toru.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';

  export let data;

  $: description = $t('pages.experiments.description');
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <meta content={$pageTitle} itemprop="name" />
  <meta content={description} itemprop="description" />
  <meta name="robots" content="index, follow" />
  <meta name="description" content={description} />
  <meta content="website" property="og:type" />
  <meta content={$pageTitle} property="og:title" />
  <meta content={description} property="og:description" />
  <meta content={$pageTitle} property="twitter:title" />
  <meta content={description} property="twitter:description" />
</svelte:head>

<HeadedBlock heading={$t('Experiments')}>
  <ToruExperiment initPromise={data.nowPlayingData} />

  <Divider class="my-8" />

  <GameOfLifeExperiment />

  <Divider class="my-8" />

  <MagneticCursorExperiment />
</HeadedBlock>
