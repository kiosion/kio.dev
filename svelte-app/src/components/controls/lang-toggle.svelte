<script lang="ts">
  import { cubicIn, cubicInOut, cubicOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { APP_LANGS, BASE_ANIMATION_DURATION } from '$lib/consts';
  import { currentLang, linkTo, t } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';
  import LanguageSmall from '$components/icons/language-small.svelte';

  const ANIM_DURATION = BASE_ANIMATION_DURATION * 0.9,
    blurInOpts = {
      duration: ANIM_DURATION,
      amount: 12,
      easing: cubicOut,
      delay: ANIM_DURATION * 0.25
    },
    blurOutOpts = {
      duration: ANIM_DURATION,
      amount: 12,
      easing: cubicIn
    };

  const handleChange = (e: Event, lang: (typeof APP_LANGS)[number]) => {
    e.preventDefault();

    if ($page?.url?.pathname?.startsWith(`/${lang}`)) {
      return Promise.resolve();
    }

    return goto(
      $linkTo(`${$page.url.pathname}${$page.url.hash}`, $page.url.searchParams, lang),
      {
        invalidateAll: true,
        replaceState: true
      }
    ).catch(() => undefined);
  };
</script>

<Hoverable let:hovered>
  <button
    class="focus-outline flex-1 rounded-lg bg-neutral-0/75 px-2.5 py-2 text-sm transition-all hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
    aria-label={$t(`Switch to ${$currentLang === APP_LANGS[0] ? 'French' : 'English'}`)}
    data-test-id="lang-toggle"
    tabindex="0"
    on:click={(e) =>
      handleChange(e, $currentLang === APP_LANGS[0] ? APP_LANGS[1] : APP_LANGS[0])}
    on:keyup={(e) =>
      e.key === 'Enter' &&
      handleChange(e, $currentLang === APP_LANGS[0] ? APP_LANGS[1] : APP_LANGS[0])}
    type="button"
  >
    {#if hovered}
      {@const nextLang = $currentLang === APP_LANGS[0] ? APP_LANGS[1] : APP_LANGS[0]}

      <div
        class="mx-auto flex h-fit flex-row items-center justify-start gap-2"
        in:blur={blurInOpts}
        out:blur={blurOutOpts}
      >
        <LanguageSmall />
        <span>
          {nextLang === APP_LANGS[0]
            ? $t('English', undefined, 'en')
            : $t('French', undefined, 'fr')}
        </span>
      </div>
    {:else}
      <div
        class="mx-auto flex h-fit flex-row items-center justify-start gap-2"
        in:blur={blurInOpts}
        out:blur={blurOutOpts}
      >
        <LanguageSmall />
        <span>
          {$currentLang === APP_LANGS[0]
            ? $t('English', undefined, 'en')
            : $t('French', undefined, 'fr')}
        </span>
      </div>
    {/if}
  </button>
</Hoverable>

<style lang="scss">
  button {
    display: grid;
  }

  div {
    grid-column: 1/2;
    grid-row: 1/2;
  }
</style>
