<script lang="ts">
  import Heading from '../../../heading.svelte';
  import { onMount } from 'svelte';
  import { t, linkTo } from '$i18n';
  import type { PageData } from './$types';

  import { goto } from '$app/navigation';
  import Button from '$components/controls/button.svelte';

  export let data: PageData;

  onMount(() => {
    if (data.error === null && data.jwt) {
      goto($linkTo(data.redirect));
    }
  });
</script>

{#if data.error}
  <Heading
    title={$t('Error')}
    text={data.error || $t('An error occurred authenticating')}
  />
  <Button href={$linkTo('/auth/login')}>{$t('Back to login')}</Button>
{:else}
  <Heading title={$t('Authenticating')} text={$t('Redirecting')} loading />
{/if}
