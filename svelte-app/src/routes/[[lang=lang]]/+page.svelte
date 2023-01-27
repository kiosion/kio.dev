<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$i18n';
  import { setupNavigation } from '$helpers/navigation';
  import { onMount } from 'svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS } from '$lib/consts';
  import { isDesktop } from '$helpers/responsive';
  import LinkNonPt from '$components/link-non-pt.svelte';
  import FloatingBgImage from '$components/floating-bg-image.svelte';
  import { theme } from '$stores/theme';

  onMount(() => {
    setupNavigation($page?.url?.pathname);
  });

  const pageTitle = t('blog & portfolio'),
    description = '';
</script>

<svelte:head>
  <title>kio.dev | {pageTitle}</title>
  <meta name="description" content={description} />
  <meta
    name="keywords"
    content="about, portfolio, blog, projects, kio.dev, kio, kiosion"
  />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content="kio.dev | {pageTitle}" />
  <meta property="og:description" content={description} />
  <meta property="twitter:url" content={$page.url.href} />
  <meta property="twitter:title" content="kio.dev | {pageTitle}" />
  <meta property="twitter:description" content={description} />
</svelte:head>

<div
  class="relative w-full max-w-[120rem] mx-auto {$isDesktop
    ? 'mb-[3rem] h-[calc(100%_-_3rem)]'
    : 'h-full'}"
  data-test-route="index"
>
  <Breakpoints queries={DEFAULT_BREAKPOINTS}>
    <svelte:fragment slot="lg">
      <div
        class="my-auto max-h-[80rem] relative pb-[10%] 2xl:pb-[12%] 4xl:pb-[14%] p-[10%] w-full h-full flex flex-col items-start justify-end gap-6 z-10"
      >
        <h1 class="font-display font-black text-8xl">
          kio<span
            class="text-violet-400 dark:text-violet-300 mx-[5px] text-8xl"
            >.</span
          >dev
        </h1>
        <div class="text-lg w-[22rem] lg:w-[28rem] xl:w-[34rem] 2xl:w-[38rem]">
          <p class="leading-loose">
            {t(
              "Hi there, welcome to my little corner of the internet! Here you'll find"
            )}
            <LinkNonPt href="/blog">{t('my blog')}</LinkNonPt>, {t(
              'a bit about'
            )}
            <LinkNonPt href="/work">{t('my work')}</LinkNonPt>,
            {t('and')}
            <LinkNonPt href="/now">{t("what I'm up to right now")}</LinkNonPt>.
          </p>
        </div>
      </div>
      <div
        class="absolute left-0 right-0 top-0 bottom-[-4rem] gradient from-stone-200 to-stone-200/30 dark:from-stone-800 dark:to-stone-800/30 z-[2]"
      />
      <FloatingBgImage
        classNames="right-[15vw] top-[15vh]"
        width={800}
        height={400}
        seed={$theme === 'light' ? '22lsAl2' : '22lsAl2a'}
        delayOffset={0}
      />
      <FloatingBgImage
        classNames="right-[10vw] top-[5vh]"
        width={600}
        height={900}
        seed={$theme === 'light' ? '1a0Phj2P' : '1a0Phj2z'}
        delayOffset={150}
      />
    </svelte:fragment>
    <svelte:fragment slot="sm">
      <div
        class="relative p-6 w-full h-full flex flex-col items-center justify-center gap-6"
      >
        <h1 class="font-display font-black text-8xl">
          kio<span
            class="text-violet-400 dark:text-violet-300 mx-[5px] text-8xl"
            >.</span
          >dev
        </h1>
        <div class="text-lg max-w-[24rem]">
          <p class="leading-loose text-center">
            {t(
              "Hi there, welcome to my little corner of the internet! Here you'll find"
            )}
            <LinkNonPt href="/blog">{t('my blog')}</LinkNonPt>, {t(
              'a bit about'
            )}
            <LinkNonPt href="/work">{t('my work')}</LinkNonPt>,
            {t('and')}
            <LinkNonPt href="/now">{t("what I'm up to right now")}</LinkNonPt>.
          </p>
        </div>
      </div>
    </svelte:fragment>
  </Breakpoints>
</div>

<style lang="scss">
  .gradient {
    background: linear-gradient(
      to top,
      var(--tw-gradient-from) 5%,
      var(--tw-gradient-to) 100%
    );
    width: calc(100% + 4px);
    left: -2px;
    right: -2px;
  }
</style>
