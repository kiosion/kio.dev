<script lang="ts">
  import Heading from './heading.svelte';
  import { onMount } from 'svelte';
  import { goto, afterNavigate } from '$app/navigation';
  import { t, linkTo } from '$i18n';
  import type { PageData } from './$types';
  import Button from '$components/controls/button.svelte';

  let redirect: string;

  afterNavigate(({ from }) => {
    console.log('navigated from:', from?.url.pathname);
    if (
      from?.url.pathname !== '/auth/login' &&
      from?.url.pathname.match(/.*(?:localhost|kio\.dev|127\.0\.0\.1)/gim)
    ) {
      redirect = from.url.pathname;
    }
  });

  onMount(() => {
    if (data.mode === 'authed') {
      redirect ||= data.redirect;
      setTimeout(() => {
        goto($linkTo(redirect));
      }, 1500);
    }
  });

  export let data: PageData;
</script>

{#if data.mode === 'authed'}
  <Heading title={$t('Logged in')} text={$t('Redirecting')} loading />
{:else}
  <Heading
    title={$t('Log in')}
    text={$t('Authenticate with one of the following providers')}
  />
  <div class="mx-auto mt-8 w-fit max-w-[80rem]">
    <ul class="flex w-64 flex-col gap-4">
      {#each data.providers as provider, i}
        <li
          class="flex w-full flex-row items-center justify-between rounded-lg bg-stone-300/50 p-4 dark:bg-stone-900/50"
        >
          {provider.name.charAt(0).toUpperCase() + provider.name.slice(1)}
          <Button href={provider.url}>{$t('Log in')}</Button>
        </li>
      {/each}
    </ul>
  </div>
{/if}
