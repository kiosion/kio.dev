<script lang="ts">
  import { page, navigating } from '$app/stores';
  import { isLocalized } from '$i18n';

  export let link: {
    name: string;
    url: string;
    active: boolean;
  };

  let classes = '';

  $: splitPath = $page.url.pathname.split('/');
  $: truePath = link.url.slice($isLocalized ? 4 : 1);

  const getOpacity = () => {
    return [$page.url.pathname, $navigating?.to?.url.pathname].includes(
      link.url
    ) ||
      link.active ||
      (splitPath.length > 1 && splitPath.indexOf(truePath) > 0)
      ? ''
      : 'transparent';
  };

  const getActive = () => {
    return [$page.url.pathname, $navigating?.to?.url.pathname].includes(
      link.url
    ) || link.active
      ? 'h-full'
      : splitPath.length > 1 && splitPath.indexOf(truePath) > 0
      ? 'h-[10%]'
      : 'transparent';
  };

  $: (classes = `${getOpacity()} ${getActive()}`), $page.url, link.active;
</script>

<div
  class="indicator absolute left-0 bottom-0 z-0 w-full h-full bg-emerald-400 dark:bg-emerald-300 {classes} duration-[40] transition-colors"
/>

<style lang="scss">
  .transparent {
    background-color: transparent !important;
  }
</style>
