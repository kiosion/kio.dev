<script lang="ts">
  import Spinner from '$components/loading/spinner.svelte';
  import { onMount } from 'svelte';
  import { t, linkTo } from '$i18n';
  import type { PageData } from './$types';

  import { goto } from '$app/navigation';

  export let data: PageData;

  onMount(() => {
    if (data.error === null && data.jwt) {
      goto(linkTo(data.returnTo));
    }
  });
</script>

<div class="relative flex flex-col gap-3">
  {#if data.error}
    <h1 class="font-display text-7xl">{t('Error')}</h1>
    <p class="font-code text-lg mb-4">{data.error}</p>
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
      <p class="font-code text-lg">{t('Redirecting')}...</p>
    </span>
  {/if}
</div>
