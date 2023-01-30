<script lang="ts">
  import Heading from '../../heading.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { t, linkTo } from '$i18n';
  import type { PageData } from './$types';
  import Button from '$components/controls/button.svelte';

  export let data: PageData;

  let isErrored = false;

  onMount(() => {
    if (data.code) {
      // Use SetTimeout so we can wait for any waterfalling navigation to finish
      // This is janky, and should be refactored, I'm sure there's a better way but I'm tired
      setTimeout(
        () =>
          goto(
            linkTo(
              `/auth/login/oauth_callback/${
                data.provider ? data.provider + '/' : ''
              }handle?code=${data.code}`
            )
          ),
        1500
      );
    } else {
      isErrored = true;
    }
  });
</script>

{#if isErrored}
  <Heading
    title={t('Error')}
    text={t(
      'Sorry, something went wrong handling your login. Please try again.'
    )}
  />
  <Button href={linkTo('/auth/login')}>{t('Back to login')}</Button>
{:else}
  <Heading
    title={t('Authenticating')}
    text="{t('Verifying your login with {provider}', {
      provider: data.provider
        ? data.provider.charAt(0).toUpperCase() + data.provider.substring(1)
        : t('the provider')
    })}..."
    loading
  />
{/if}
