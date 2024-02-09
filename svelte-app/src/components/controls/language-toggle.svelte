<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { APP_LANGS } from '$lib/consts';
  import { currentLang, linkTo, t } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltip.svelte';

  const handleClick = (event: Event, lang: (typeof APP_LANGS)[number]) => {
    event.preventDefault();
    if ($page?.url?.pathname?.startsWith(`/${lang}`)) {
      return;
    }

    goto(
      $linkTo(`${$page.url.pathname}${$page.url.hash}`, $page.url.searchParams, lang),
      {
        invalidateAll: true,
        replaceState: true
      }
    ).catch(() => undefined);
  };
</script>

<Hoverable>
  <Tooltip
    text={$t($currentLang === APP_LANGS[0] ? 'Switch to French' : 'Switch to English')}
    delay={150}
    fixed
  >
    <button
      aria-label={$t(
        $currentLang === APP_LANGS[0] ? 'Switch to French' : 'Switch to English'
      )}
      tabindex="0"
      data-test-id="language-toggle"
      on:click={(e) => {
        handleClick(e, $currentLang === APP_LANGS[0] ? APP_LANGS[1] : APP_LANGS[0]);
      }}
    >
      <Icon name="script" size={18} />
    </button>
  </Tooltip>
</Hoverable>

<style lang="scss">
  @import '@styles/mixins';

  button {
    @apply -m-1.5 flex items-center justify-center rounded-sm;

    height: 24px;
    width: 24px;

    @include focus-state(lg);

    &:hover,
    &:focus-visible {
      @apply text-accent-light;
    }
  }

  :global(.dark) {
    button {
      @include focus-state(lg, dark);

      &:hover,
      &:focus-visible {
        @apply text-accent-dark;
      }
    }
  }
</style>
