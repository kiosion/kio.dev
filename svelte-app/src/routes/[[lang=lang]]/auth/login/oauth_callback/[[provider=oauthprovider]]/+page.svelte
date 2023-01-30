<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Spinner from '$components/loading/spinner.svelte';
  import { t, linkTo } from '$i18n';
  import type { PageData } from './$types';

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
        3000
      );
    } else {
      isErrored = true;
    }
  });
</script>

<div class="relative flex flex-col gap-3">
  {#if isErrored}
    <h1 class="font-display text-7xl">{t('Error')}</h1>
    <p class="font-code text-lg mb-4">
      {t('Sorry, something went wrong handling your login.')}
      {t('Please try again.')}
    </p>
    <a
      href="/auth/login"
      class="w-fit text-base py-1 px-3 rounded-md border-2 border-stone-400 hover:border-stone-800 hover:dark:border-violet-100 hover:bg-violet-400 hover:text-stone-900 transition-[border-color,background-color,box-shadow,color] shadow-violet-300 hover:shadow-lg"
    >
      {t('Back to login')}
    </a>
  {:else}
    <h1 class="font-display text-7xl">{t('Authenticating')}</h1>
    <span class="flex flex-row gap-4 items-center">
      <Spinner />
      <p class="font-code text-lg">
        {t('Verifying your login with {provider}', {
          provider: data.provider
            ? data.provider.charAt(0).toUpperCase() + data.provider.substring(1)
            : t('the provider')
        })}...
      </p>
    </span>
  {/if}
</div>
