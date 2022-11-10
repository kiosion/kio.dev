<script lang="ts">
  import { page, navigating } from '$app/stores';
  import { APP_LANGS } from '$lib/consts';

  export let link: {
    name: string;
    url: string;
    active: boolean;
  };

  let classes = '';

  $: isLocalized = APP_LANGS.includes($page?.params?.lang);
  $: splitPath = $page.url.pathname.split('/');
  $: truePath = link.url.slice(isLocalized ? 4 : 1);

  const getOpacity = () => {
    return [$page.url.pathname, $navigating?.to?.url.pathname].includes(
      link.url
    ) ||
      link.active ||
      (splitPath.length > 1 && splitPath.indexOf(truePath) > 0)
      ? 'opacity-100'
      : 'opacity-0';
  };

  const getActive = () => {
    return [$page.url.pathname, $navigating?.to?.url.pathname].includes(
      link.url
    ) || link.active
      ? 'active'
      : splitPath.length > 1 && splitPath.indexOf(truePath) > 0
      ? 'dot'
      : '';
  };

  $: (classes = `${getOpacity()} ${getActive()}`), $page.url, link.active;
</script>

<div
  class="indicator absolute z-0 {classes} bg-emerald-400 dark:bg-emerald-300 rounded-full transition-opacity ease-in"
/>

<style lang="scss">
  .indicator {
    width: 4px;
    height: 4px;
    transform: translateX(-12px);

    &.dot,
    &:not(.dot):not(.active) {
      animation: 300ms ease slideOut;
    }
    &.active {
      width: 100%;
      height: 2px;
      transform: translateX(0px);
      animation: 300ms ease slideOver;
    }
  }

  @keyframes slideOut {
    from {
      width: 100%;
      height: 2px;
      transform: translateX(0px);
    }
    to {
      width: 4px;
      height: 4px;
      transform: translateX(-12px);
    }
  }
  @keyframes slideOver {
    from {
      width: 2px;
      height: 2px;
      transform: translateX(-12px);
    }
    to {
      width: 100%;
      height: 2px;
      transform: translateX(0px);
    }
  }
</style>
