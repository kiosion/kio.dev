<script lang="ts">
  import '../app.scss';

  import { onDestroy, onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { fly } from 'svelte/transition';

  import { classList } from 'svelte-body';
  import { useMediaQuery } from 'svelte-breakpoints';

  import { browser } from '$app/environment';
  import { navigating, page } from '$app/stores';
  import { check as checkTranslations, currentLang, isLocalized, t } from '$i18n';
  import { APP_LANGS, BASE_ANIMATION_DURATION, DEFAULT_APP_LANG } from '$lib/consts';
  import { ENV, SELF_BASE_URL } from '$lib/env';
  import Settings, { loading } from '$stores/settings';

  import Footer from '$components/footer.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import PageTransition from '$components/layouts/page-transition.svelte';
  import ScrollContainer from '$components/layouts/scroll-container.svelte';
  import Nav from '$components/nav.svelte';

  import type { Unsubscriber } from 'svelte/store';

  let unsubscribers = [] as Unsubscriber[],
    setLoadingTimer: ReturnType<typeof setTimeout> | undefined,
    appLoaded = false;

  const { theme, reduce_motion } = Settings,
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

  unsubscribers.push(
    useMediaQuery('(prefers-reduced-motion: reduce)').subscribe((value) => {
      reduce_motion?.set(value);
    })
  );

  onMount(() => {
    if (!browser) {
      return;
    }

    unsubscribers.push(
      navigating.subscribe((navigation) => {
        if (!navigation) {
          if (setLoadingTimer) {
            clearTimeout(setLoadingTimer);
          }
          loading.set(false);
        } else if (navigation.from !== navigation.to) {
          setLoadingTimer && clearTimeout(setLoadingTimer);
          setLoadingTimer = setTimeout(() => loading.set(true), 500);
        }
      })
    );

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

    setTimeout(() => {
      loading.set(false);
    }, 1000);

    appLoaded = true;
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
  $: browser && (document.documentElement.lang = $currentLang);
</script>

<svelte:head>
  <meta name="author" content="Kio" />
  <meta name="theme-color" content={$theme === 'dark' ? '#16160e' : '#e5e4e6'} />
  <meta property="og:locale" content={$currentLang === 'fr' ? 'fr_CA' : 'en_CA'} />
  <meta property="og:site_name" content="kio.dev" />
  <meta property="og:url" content={$page?.url?.href} />
  <meta property="og:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />
  <meta property="twitter:url" content={$page?.url?.href} />
  <meta property="twitter:site" content="@0xKI0" />
  <meta property="twitter:image" content="{SELF_BASE_URL}/assets/dark-embed.png" />
</svelte:head>

<svelte:body use:classList={[$theme, $navigating ? 'is-loading' : 'is-loaded']} />

<span
  role="button"
  aria-label={$t('Skip to content')}
  tabindex="0"
  in:fly={{ delay: 100, duration: BASE_ANIMATION_DURATION / 3, y: -40 }}
  out:fly={{ duration: BASE_ANIMATION_DURATION / 3, y: 40 }}
  on:keydown={skipToContent}>{$t('Skip to content')}</span
>

<div class="main" in:fly={{ delay: 100, duration: 100, y: -40 }}>
  <Nav loaded={appLoaded && !$loading} />
  <ScrollContainer>
    <PageTransition pathname={data.pathname}>
      <ContentWrapper>
        <slot />
        <Footer config={data.config} />
      </ContentWrapper>
    </PageTransition>
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
  }

  .main {
    @apply relative h-full w-full overflow-x-hidden rounded-xl text-dark;

    @include media(lg) {
      @apply text-lg;
    }
  }

  :global(.dark) {
    span {
      @apply bg-black text-light;

      @include focus-state(sm, dark);
    }

    .main {
      @apply text-light;
    }
  }
</style>
