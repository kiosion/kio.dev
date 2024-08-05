<script lang="ts">
  import { t } from '$lib/i18n';
  import { pageTitle } from '$lib/navigation';

  import Divider from '$components/divider.svelte';
  import GameOfLifeExperiment from '$components/experiments/gol.svelte';
  import MagneticCursorExperiment from '$components/experiments/mag-cursor.svelte';
  import ToruExperiment from '$components/experiments/toru.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';

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

<BaseContainer>
  <HeadedBlock heading={$t('Experiments')} first>
    <ToruExperiment initPromise={data.nowPlayingData}></ToruExperiment>

    <span
      class="block w-full min-w-0 flex-1 border-b border-dashed border-neutral-200 transition-colors dark:border-neutral-400"
    ></span>

    <GameOfLifeExperiment></GameOfLifeExperiment>

    <span
      class="block w-full min-w-0 flex-1 border-b border-dashed border-neutral-200 transition-colors dark:border-neutral-400"
    ></span>

    <MagneticCursorExperiment></MagneticCursorExperiment>
  </HeadedBlock>
</BaseContainer>
