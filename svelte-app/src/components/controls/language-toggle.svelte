<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { currentLang, linkTo, t } from '$i18n';
  import { APP_LANGS } from '$lib/consts';
  import { navOpen } from '$stores/navigation';

  import Dialog from '$components/dialog.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltip.svelte';

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
</script>

<div class="flex items-center justify-center">
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

  <Hoverable>
    <Tooltip
      text={$t('Switch language to {language}', {
        language: $currentLang === 'en' ? $t('French') : $t('English')
      })}
      delay={150}
      fixed
    >
      <button
        class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-accent-light dark:hover:text-accent-dark {$$props.class ||
          ''}"
        aria-label={$t(
          $currentLang === 'en'
            ? 'Switch language to French'
            : 'Switch language to English'
        )}
        tabindex="0"
        on:click={(e) => {
          handleClick(e, $currentLang === 'en' ? 'fr' : 'en');
        }}
      >
        <Icon icon="script" />
      </button>
    </Tooltip>
  </Hoverable>
</div>
