<script lang="ts">
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { APP_LANGS, BASE_ANIMATION_DURATION } from '$lib/consts';
  import { currentLang, linkTo, t } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';

  const ANIM_DURATION = BASE_ANIMATION_DURATION * 1.25,
    blurInOpts = {
      duration: ANIM_DURATION,
      amount: 8,
      easing: cubicOut,
      delay: ANIM_DURATION * 0.5
    },
    blurOutOpts = {
      duration: ANIM_DURATION,
      amount: 8,
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
    class="flex-1 rounded-lg bg-neutral-0/75 px-2.5 py-2 text-sm transition-all hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M11 5a.75.75 0 0 1 .688.452l3.25 7.5a.75.75 0 1 1-1.376.596L12.89 12H9.109l-.67 1.548a.75.75 0 1 1-1.377-.596l3.25-7.5A.75.75 0 0 1 11 5Zm-1.24 5.5h2.48L11 7.636 9.76 10.5ZM5 1a.75.75 0 0 1 .75.75v1.261a25.27 25.27 0 0 1 2.598.211.75.75 0 1 1-.2 1.487c-.22-.03-.44-.056-.662-.08A12.939 12.939 0 0 1 5.92 8.058c.237.304.488.595.752.873a.75.75 0 0 1-1.086 1.035A13.075 13.075 0 0 1 5 9.307a13.068 13.068 0 0 1-2.841 2.546.75.75 0 0 1-.827-1.252A11.566 11.566 0 0 0 4.08 8.057a12.991 12.991 0 0 1-.554-.938.75.75 0 1 1 1.323-.707c.049.09.099.181.15.271.388-.68.708-1.405.952-2.164a23.941 23.941 0 0 0-4.1.19.75.75 0 0 1-.2-1.487c.853-.114 1.72-.185 2.598-.211V1.75A.75.75 0 0 1 5 1Z"
            clip-rule="evenodd"
          />
        </svg>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M11 5a.75.75 0 0 1 .688.452l3.25 7.5a.75.75 0 1 1-1.376.596L12.89 12H9.109l-.67 1.548a.75.75 0 1 1-1.377-.596l3.25-7.5A.75.75 0 0 1 11 5Zm-1.24 5.5h2.48L11 7.636 9.76 10.5ZM5 1a.75.75 0 0 1 .75.75v1.261a25.27 25.27 0 0 1 2.598.211.75.75 0 1 1-.2 1.487c-.22-.03-.44-.056-.662-.08A12.939 12.939 0 0 1 5.92 8.058c.237.304.488.595.752.873a.75.75 0 0 1-1.086 1.035A13.075 13.075 0 0 1 5 9.307a13.068 13.068 0 0 1-2.841 2.546.75.75 0 0 1-.827-1.252A11.566 11.566 0 0 0 4.08 8.057a12.991 12.991 0 0 1-.554-.938.75.75 0 1 1 1.323-.707c.049.09.099.181.15.271.388-.68.708-1.405.952-2.164a23.941 23.941 0 0 0-4.1.19.75.75 0 0 1-.2-1.487c.853-.114 1.72-.185 2.598-.211V1.75A.75.75 0 0 1 5 1Z"
            clip-rule="evenodd"
          />
        </svg>
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
