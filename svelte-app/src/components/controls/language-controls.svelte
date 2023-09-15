<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { linkTo, t } from '$i18n';
  import { APP_LANGS } from '$lib/consts';
  import { navOpen } from '$stores/navigation';

  import Dialog from '$components/dialog.svelte';
  import Hoverable from '$components/hoverable.svelte';

  export let langs = [
      { lang: 'en', name: 'English' },
      { lang: 'fr', name: 'Français' }
    ],
    forNav = false;

  let modalOpen = false;

  const handleClick = (event: Event, lang: string) => {
      event.preventDefault();
      if ($page?.url?.pathname?.startsWith(`/${lang}`)) {
        return;
      }

      switch (lang) {
        case 'en':
          goto($linkTo($page.url.pathname, lang)).catch(() => undefined);
          break;
        case 'fr':
          modalOpen = true;
          break;
      }
    },
    modalConfirm = () => {
      goto($linkTo($page.url.pathname, APP_LANGS[1]), {
        invalidateAll: true,
        replaceState: true
      }).catch(() => undefined);
      modalOpen = false;
      navOpen.set(false);
    };

  $: _langs = langs as ((typeof langs)[0] & { active: boolean })[];
</script>

<Dialog
  title="{$t('Change language')}?"
  description={$t(
    'French translations are incomplete, and hilariously broken in places :)'
  )}
  confirmText={$t('Continue')}
  open={modalOpen}
  on:close={() => (modalOpen = false)}
  on:confirm={modalConfirm}
/>

<div class={$$props.class || ''}>
  <span class="cursor-default select-none">{$t('Language')} (</span>
  {#each _langs as lang, i}
    <Hoverable bind:hovered={lang.active}>
      <a
        class="focusOutline-sm rounded-sm"
        class:active={lang.active}
        class:forNav
        aria-label={$t('Switch language to {lang}', {
          lang: lang.name
        })}
        href={$linkTo($page.url.pathname, lang.lang)}
        target="_self"
        role="button"
        tabindex="0"
        on:click={(e) => {
          handleClick(e, lang.lang);
        }}
        on:keydown={(e) => {
          if (e.code === 'Enter' || e.code === 'Space') {
            handleClick(e, lang.lang);
          }
        }}
      >
        {lang.lang}
      </a>
    </Hoverable>
    {#if i < _langs.length - 1}
      <span class="cursor-default select-none">/</span>
    {/if}
  {/each}
  <span class="cursor-default select-none">)</span>
</div>

<style lang="scss">
  a {
    &.forNav {
      @apply px-1;

      &.active {
        @apply text-dark;
      }
    }
    &:not(.forNav) {
      @apply decoration-accent-light decoration-2;

      &.active {
        @apply underline;
      }
    }
  }

  :global(.dark) {
    a {
      &.forNav {
        &.active {
          @apply text-light;
        }
      }
      &:not(.forNav) {
        @apply decoration-accent-dark;
      }
    }
  }
</style>
