<script lang="ts">
  import { t } from '$lib/i18n';
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
  <ToruExperiment initPromise={data.nowPlayingData}></ToruExperiment>

  <Divider class="my-8"></Divider>

  <GameOfLifeExperiment></GameOfLifeExperiment>

  <Divider class="my-8"></Divider>

  <MagneticCursorExperiment></MagneticCursorExperiment>
</HeadedBlock>
