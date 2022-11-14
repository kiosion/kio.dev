<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { setupNavigation } from '$helpers/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    setupNavigation($page?.url?.pathname);
  });
</script>

<svelte:head>
  <title>kio.dev | {t('blog & portfolio')}</title>
  <meta name="description" content="" />
  <meta
    name="keywords"
    content="about, portfolio, blog, projects, kio.dev, kio, kiosion"
  />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content="kio.dev | {t('blog & portfolio')}" />
  <meta property="og:description" content="" />
  <meta property="twitter:url" content={$page.url.href} />
  <meta property="twitter:title" content="kio.dev | {t('blog & portfolio')}" />
  <meta property="twitter:description" content="" />
</svelte:head>

<div class="relative" data-test-route="index">
  <div
    class="mt-[20vh] md:mt-[46vh] md:-translate-x-4 h-fit w-fit mx-auto flex flex-col items-center  justify-center gap-2"
  >
    <p class="font-display text-3xl font-bold w-fit mt-14 md:-mt-[10vh] mb-5">
      {t("Hi, I'm Kio")}<span class="text-emerald-300 ml-[2px]">.</span>
    </p>
    <p class="font-sans text-lg -mb-1 text-center">
      {t('Software engineer / web dev / artist')}
    </p>
    <p class="font-sans text-lg text-center">
      {t('Lover of cats & all things tech')}
    </p>
  </div>
</div>
