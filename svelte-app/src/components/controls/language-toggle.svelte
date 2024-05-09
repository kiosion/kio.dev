<script lang="ts">
  import { circInOut } from 'svelte/easing';
  import { get } from 'svelte/store';
  import { slide } from 'svelte/transition';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { APP_LANGS } from '$lib/consts';
  import { currentLang, linkTo, t } from '$lib/i18n';
  import { isMobile } from '$lib/responsive';

  import Hoverable from '$components/hoverable.svelte';

  const BASE_TIMEOUT_MS = 25;

  const handleClick = (event: Event, lang: (typeof APP_LANGS)[number]) => {
    event.preventDefault();

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

  let showDropdown = false,
    dropdown: HTMLDivElement | undefined,
    dropdownTimeout: ReturnType<typeof setTimeout> | undefined;

  const handleShow = () => {
    clearTimeout(dropdownTimeout);
    if (get(isMobile)) {
      return;
    }

    dropdownTimeout = setTimeout(() => (showDropdown = true), BASE_TIMEOUT_MS * 2);
  };

  const handleHide = () => {
    clearTimeout(dropdownTimeout);
    dropdownTimeout = setTimeout(() => (showDropdown = false), BASE_TIMEOUT_MS);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (
        dropdown !== document?.activeElement &&
        !dropdown?.contains(document?.activeElement)
      ) {
        showDropdown = false;
      }
    }, 0);
  };

  const dropdownOptions = [
    {
      label: 'English',
      value: APP_LANGS[0]
    },
    {
      label: 'French',
      value: APP_LANGS[1]
    }
  ] as const;
</script>

<svelte:window on:click={handleBlur} />

<div
  class="focus-outline relative z-10 -m-1 cursor-pointer select-none rounded-xs px-2 py-1 font-mono text-xs hover:bg-neutral-100 focus-visible:bg-neutral-100 dark:hover:bg-neutral-600 dark:focus-visible:bg-neutral-600"
  on:mouseenter={handleShow}
  on:focus={handleShow}
  on:mouseleave={handleHide}
  on:blur={handleBlur}
  on:click={(e) =>
    get(isMobile) &&
    handleClick(e, $currentLang === APP_LANGS[0] ? APP_LANGS[1] : APP_LANGS[0])}
  on:keyup={(e) =>
    e.key === 'Enter' &&
    get(isMobile) &&
    handleClick(e, $currentLang === APP_LANGS[0] ? APP_LANGS[1] : APP_LANGS[0])}
  role="menu"
  aria-label="Change language"
  tabindex="0"
>
  <span class="z-10">
    [{$currentLang === APP_LANGS[0] ? 'en' : 'fr'}]<span class="hidden md:inline-block"
      >&nbsp;{$t('Language').toLowerCase()}</span
    >
  </span>
  {#if showDropdown}
    <div
      class="absolute left-0 right-0 top-0 -z-[1] flex flex-col items-start rounded-xs bg-neutral-100 pt-6 font-mono text-xs dark:bg-neutral-600"
      bind:this={dropdown}
      transition:slide={{ axis: 'y', duration: 125, easing: circInOut }}
    >
      {#each dropdownOptions as opt}
        <Hoverable let:hovered>
          <button
            class="focus-outline w-full px-2 py-2.5 text-left disabled:cursor-not-allowed disabled:opacity-50"
            class:bg-neutral-200={hovered}
            class:dark:bg-neutral-500={hovered}
            on:click={(e) => {
              handleClick(e, opt.value).finally(() => {
                clearTimeout(dropdownTimeout);
                showDropdown = false;
              });
            }}
            on:blur={handleBlur}
            type="button"
            role="menuitem"
            disabled={$currentLang === opt.value}
          >
            {$t(opt.label).toLowerCase()}
          </button>
        </Hoverable>
      {/each}
    </div>
  {/if}
</div>
