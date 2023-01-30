<script lang="ts">
  import Heading from '../heading.svelte';
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

<Heading
  title={t('Authenticated')}
  text={provider
    ? t('Successfully authenticated with {provider}', {
        provider: provider.charAt(0).toUpperCase() + provider.substring(1)
      })
    : t('Successfully authenticated')}
  loading
/>
