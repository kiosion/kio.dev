<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { currentLang, linkTo, t } from '$i18n';
  import { APP_LANGS } from '$lib/consts';
  import { navOpen } from '$stores/navigation';

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

    navOpen.set(false);
  };
</script>

<Hoverable>
  <Tooltip
    text={$t($currentLang === APP_LANGS[0] ? 'Switch to french' : 'Switch to english')}
    delay={150}
    fixed
  >
    <button
      class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-accent-light dark:hover:text-accent-dark {$$props.class ||
        ''}"
      aria-label={$t(
        $currentLang === APP_LANGS[0] ? 'Switch to french' : 'Switch to english'
      )}
      tabindex="0"
      on:click={(e) => {
        handleClick(e, $currentLang === APP_LANGS[0] ? APP_LANGS[1] : APP_LANGS[0]);
      }}
    >
      <Icon icon="script" />
    </button>
  </Tooltip>
</Hoverable>
