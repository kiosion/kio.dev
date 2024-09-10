<script lang="ts">
  import { get } from 'svelte/store';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { APP_LANGS } from '$lib/consts';
  import { currentLang, linkTo, t } from '$lib/i18n';

  import BaseToggle from '$components/controls/base-toggle.svelte';
  import LanguageSmall from '$components/icons/language-small.svelte';

  const handleChange = (e: Event) => {
    e.preventDefault();

    const newLang = get(currentLang) === APP_LANGS[0] ? APP_LANGS[1] : APP_LANGS[0];

    if ($page?.url?.pathname?.startsWith(`/${newLang}`)) {
      return Promise.resolve();
    }

    return goto(
      $linkTo(`${$page.url.pathname}${$page.url.hash}`, $page.url.searchParams, newLang),
      {
        invalidateAll: true,
        replaceState: true
      }
    ).catch(() => undefined);
  };
</script>

<BaseToggle
  icon={LanguageSmall}
  aria-label={$t(`Switch to ${$currentLang === APP_LANGS[0] ? 'French' : 'English'}`)}
  options={[
    {
      label: 'En',
      value: APP_LANGS[0],
      selected: $currentLang === APP_LANGS[0]
    },
    {
      label: 'Fr',
      value: APP_LANGS[1],
      selected: $currentLang === APP_LANGS[1]
    }
  ]}
  on:click={handleChange}
/>
