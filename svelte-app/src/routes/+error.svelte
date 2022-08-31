<script lang="ts">
  import { page } from '$app/stores';
  import ContentWrapper from '$components/content-wrapper.svelte';
  import { navOptions, pageHeading } from '$stores/nav';
  import IconHeader from '$components/icon-header.svelte';
  import { ENV } from '$lib/env';
  import Divider from '$components/divider.svelte';
  import type { PixelIcon } from '@/lib/types';

  const Downasaur = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/downasaur.svg').then((Icon) => Icon.default);

  navOptions.set({ down: '', up: '/' });
  pageHeading.set(`Error ${$page.status ? `| ${$page.status}` : ''}`);

  let message = 'Something went wrong';

  switch ($page.status) {
    case 404:
      message = "Sorry, that resource doesn't seem to exist";
      break;
    case 403:
      message = "Oops, you don't have permission to access that";
  }
</script>

<svelte:head>
  <title>kio.dev | {$page.status}</title>
</svelte:head>

<div data-test-route="error" class="mt-12">
  <ContentWrapper>
    <IconHeader icon="Downasaur" text={message} classes="my-8 mx-auto w-fit" />
    <div class="mx-12">
      <Divider />
    </div>
    <div class="mt-8 flex w-full items-center justify-center">
      <code
        class="bg-slate-200 dark:bg-slate-900 rounded-md py-2 px-3 text-code text-base text-center"
      >
        {#if ENV === 'development'}
          {$page.error?.stack ? $page.error.stack : 'Unknown error'}
        {:else}
          {$page.error?.message ? $page.error.message : 'Unkown error'}
        {/if}
      </code>
    </div>
  </ContentWrapper>
</div>

<style lang="scss">
  code {
    overflow-wrap: anywhere;
  }
</style>
