<script lang="ts">
  import Spinner from '$components/loading/spinner.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { t, linkTo } from '$i18n';
  import type { PageData } from './$types';

  onMount(() => {
    if (data.status === 'success') {
      setTimeout(() => {
        goto($linkTo('/'));
      }, 1500);
    }
  });

  export let data: PageData;

  $: status = data.status;
</script>

<div class="relative flex flex-col gap-3">
  {#if status === 'error'}
    <h1 class="font-display text-7xl">{$t('Error')}</h1>
    <p class="font-code text-base">
      {$t('Sorry, something went wrong while logging you out.')}
      {$t('Please try again.')}
    </p>
  {:else}
    <h1 class="font-display text-7xl">{$t('Logged out')}</h1>
    <span class="flex flex-row items-center gap-3">
      <Spinner />
      <p class="font-code text-base">{$t('Redirecting')}...</p>
    </span>
  {/if}
</div>
