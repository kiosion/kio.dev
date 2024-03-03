<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { APP_LANGS } from '$lib/consts';
  import { currentLang, linkTo, t } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

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
  >
    <button
      class="focus-outline -m-1.5 flex h-6 w-6 items-center justify-center rounded-sm hover:text-accent-light focus-visible:text-accent-light dark:hover:text-accent-dark dark:focus-visible:text-accent-dark"
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
