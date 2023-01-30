<script lang="ts">
  import Spinner from '$components/loading/spinner.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { t } from '$i18n';
  import type { PageData } from './$types';

  onMount(() => {
    setTimeout(() => {
      goto('/');
    }, 1500);
  });

  export let data: PageData;

  $: provider = data?.provider;
</script>

<div class="relative flex flex-col gap-3">
  <h1 class="font-display text-7xl">{t('Authenticated')}</h1>
  <span class="flex flex-row gap-3 items-center">
    <Spinner />
    {#if provider}
      <p class="font-code text-lg">
        {t('Successfully authenticated with {provider}', {
          provider: provider.charAt(0).toUpperCase() + provider.substring(1)
        })}...
      </p>
    {:else}
      <p class="font-code text-lg">{t('Successfully authenticated')}...</p>
    {/if}
  </span>
</div>
