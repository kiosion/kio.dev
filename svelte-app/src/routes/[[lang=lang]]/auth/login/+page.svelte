<script lang="ts">
  import Spinner from '$components/loading/spinner.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { t, linkTo } from '$i18n';
  import type { PageData } from './$types';

  onMount(() => {
    if (data.mode === 'authed') {
      setTimeout(() => {
        goto(linkTo('/'));
      }, 1500);
    }
  });

  export let data: PageData;
</script>

<div class="relative flex flex-col gap-3">
  {#if data.mode === 'authed'}
    <h1 class="font-display text-7xl">{t('Logged in')}</h1>
    <span class="flex flex-row items-center gap-3">
      <Spinner />
      <p class="font-code text-base">{t('Redirecting')}...</p>
    </span>
  {:else}
    <h1 class="font-display text-7xl">{t('Log in')}</h1>
    <p class="font-code text-base">
      {t('Authenticate with one of the following providers')}
    </p>

    <div class="mx-auto mt-8 max-w-[80rem] w-fit">
      <ul class="flex flex-col gap-4 w-64">
        {#each data.providers as provider, i}
          <li
            class="flex flex-row w-full items-center justify-between p-4 rounded-lg bg-stone-300/50 dark:bg-stone-900/50"
          >
            {provider.name.charAt(0).toUpperCase() + provider.name.slice(1)}
            <a
              class="w-fit text-base py-1 px-3 rounded-md border-2 border-stone-400 hover:border-stone-800 hover:dark:border-violet-100 hover:bg-violet-400 hover:text-stone-900 transition-[border-color,background-color,box-shadow,color] shadow-violet-300 hover:shadow-lg"
              href={provider.url}>{t('Log in')}</a
            >
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
