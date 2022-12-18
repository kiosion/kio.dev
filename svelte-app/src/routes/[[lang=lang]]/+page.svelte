<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { setupNavigation } from '$helpers/navigation';
  import { onMount } from 'svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS } from '$lib/consts';
  import IconHeader from '$components/headings/icon-header.svelte';

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

<div class="h-fit w-full translate-y-[50%]" data-test-route="index">
  <Breakpoints queries={DEFAULT_BREAKPOINTS}>
    <svelte:fragment slot="lg">
      <div
        class="mt-[40vh] flex flex-col mx-auto items-center justify-center gap-2"
      >
        <p
          class="font-display text-3xl font-bold w-fit mt-14 md:-mt-[10vh] mb-5"
        >
          {t("Hi there, I'm Kio")}<span class="text-emerald-300 ml-[2px]"
            >.</span
          >
        </p>
        <p class="font-sans text-lg -mb-1 text-center leading-9">
          {t('Software engineer / web dev / artist')}<br />
          {t('Lover of cats & all things tech')}<br />
          {t('Welcome to my little corner of the internet!')}
        </p>
        <!-- <IconHeader icon="book-open" text={t('Recent posts')} />
        <IconHeader icon="art-text" text={t('Recent projects')} /> -->
      </div>
    </svelte:fragment>
    <svelte:fragment slot="sm">
      <div
        class="mt-[12vh] flex flex-col mx-auto items-center justify-center gap-2"
      >
        <p
          class="font-display text-3xl font-bold w-fit mt-14 md:-mt-[10vh] mb-5"
        >
          {t("Hi there, I'm Kio")}<span class="text-emerald-300 ml-[2px]"
            >.</span
          >
        </p>
        <p class="font-sans text-lg -mb-1 text-center leading-9">
          {t('Software engineer / web dev / artist')}<br />
          {t('Lover of cats & all things tech')}<br />
          {t('Welcome to my little corner of the internet!')}
        </p>
      </div>
    </svelte:fragment>
  </Breakpoints>
</div>
