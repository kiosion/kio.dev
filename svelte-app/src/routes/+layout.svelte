<script lang="ts">
  // eslint-disable-next-line no-restricted-imports
  import '../app.scss';

  import { onDestroy, onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { fly } from 'svelte/transition';

  import { classList } from 'svelte-body';

  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import {
    APP_LANGS,
    APP_THEMES,
    BASE_ANIMATION_DURATION,
    DEFAULT_APP_LANG
  } from '$lib/consts';
  import { ENV, SELF_BASE_URL } from '$lib/env';
  import { check as checkTranslations, currentLang, isLocalized, t } from '$lib/i18n';
  import Settings, { loading } from '$lib/settings';

  import Footer from '$components/footer.svelte';
  import Header from '$components/header.svelte';
  import ConstrainWidth from '$components/layouts/constrain-width.svelte';
  import PageContent from '$components/layouts/page-content.svelte';
  import PageTransition from '$components/layouts/page-transition.svelte';
  import ScrollContainer from '$components/layouts/scroll-container.svelte';
  import TooltipManager from '$components/tooltips/manager.svelte';

  import type { Unsubscriber } from 'svelte/store';

  let unsubscribers = [] as Unsubscriber[],
    setLoadingTimer: ReturnType<typeof setTimeout> | undefined;

  const { theme } = Settings,
    skipToContent = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        const content = document.getElementById('content-wrapper'),
          focusable = content?.querySelectorAll(
            '[tabindex="0"], a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
          ),
          elem = focusable?.[0] as HTMLElement | null;
        elem?.focus();
        // @ts-expect-error - scrollToOptions is not yet in the DOM typings
        elem?.scrollTo({ behavior: 'smooth', block: 'center' });
      }
    };

  beforeNavigate((event) => {
    clearTimeout(setLoadingTimer);

    if (event.from !== event.to) {
      setLoadingTimer = setTimeout(() => loading.set(true), 100);
    }
  });

  afterNavigate(() => {
    clearTimeout(setLoadingTimer);
    loading.set(false);
  });

  onMount(() => {
    if (!browser) {
      return;
    }

    const currentTheme = get(theme);

    if (currentTheme === 'dark' && document.body.classList.contains('light')) {
      document.body.classList.remove('dark');
      theme.set('light');
    } else if (currentTheme === 'light' && document.body.classList.contains('dark')) {
      document.body.classList.remove('light');
      theme.set('dark');
    }

    unsubscribers.push(
      currentLang.subscribe((lang) => {
        document.documentElement.lang = lang;
      })
    );

    ENV !== 'production' && checkTranslations();

    setTimeout(() => loading.set(false), 1000);
  });

  onDestroy(() => unsubscribers.forEach((u) => u()));

  export let data;

  $: isLocalized.set(
    APP_LANGS.includes($page?.params?.lang as (typeof APP_LANGS)[number])
  );
  $: currentLang.set(
    APP_LANGS.includes($page?.params?.lang as (typeof APP_LANGS)[number])
      ? $page?.params?.lang
      : DEFAULT_APP_LANG
  );
</script>

<svelte:head>
  <meta name="author" content="Kio" />
  <meta name="theme-color" content={$theme === APP_THEMES.DARK ? '#16160e' : '#e5e4e6'} />
  <meta
    property="og:locale"
    content={$currentLang === APP_LANGS[1] ? 'fr_CA' : 'en_CA'}
  />
  <meta property="og:site_name" content="kio.dev" />
  <meta property="og:url" content={$page?.url?.href} />
  <meta property="og:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />
  <meta property="twitter:url" content={$page?.url?.href} />
  <meta property="twitter:site" content="@0xKI0" />
  <meta property="twitter:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />
</svelte:head>

<svelte:body use:classList={[$theme, $loading ? 'is-loading' : 'is-loaded']} />

<span
  role="button"
  aria-label={$t('Skip to content')}
  tabindex="0"
  in:fly={{ delay: 100, duration: BASE_ANIMATION_DURATION / 3, y: -40 }}
  out:fly={{ duration: BASE_ANIMATION_DURATION / 3, y: 40 }}
  on:keydown={skipToContent}>{$t('Skip to content')}</span
>

<div class="main" in:fly={{ delay: 100, duration: 100, y: -40 }}>
  <ScrollContainer let:element>
    <ConstrainWidth>
      <Header />
    </ConstrainWidth>

    <PageTransition pathname={data.pathname}>
      <ConstrainWidth id="content-wrapper">
        <PageContent>
          <slot />
          <Footer config={data.config} />
        </PageContent>
      </ConstrainWidth>
    </PageTransition>

    <TooltipManager container={element} />
  </ScrollContainer>
</div>

<style lang="scss">
  @import '@styles/mixins';
  @import '@styles/variables';

  span {
    @apply absolute left-1/2 top-0 z-50 -mt-14 -translate-x-1/2 cursor-pointer rounded-md bg-light px-4 py-2 text-sm font-bold text-dark transition-[margin-top,background-color,color];

    @include focus-state(sm);

    &:focus-visible {
      @apply mt-4;
    }

    @include dark {
      @apply bg-black text-light;
    }
  }

  .main {
    @apply relative h-full w-full overflow-x-hidden rounded-xl text-dark;

    @include media(lg) {
      @apply text-lg;
    }

    @include dark {
      @apply text-light;
    }
  }
</style>
