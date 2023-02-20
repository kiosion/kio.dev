<script lang="ts">
  import { page, navigating } from '$app/stores';
  import { isLocalized } from '$i18n';

  export let link: {
    name: string;
    url: string;
    active: boolean;
  };

  let classNames = 'active-nil';

  $: splitPath = $page?.url.pathname.split('/') || [];
  $: truePath = link.url.slice($isLocalized ? 4 : 1);

  const getActive = (): 'root' | 'sub' | 'nil' => {
    const isRoot = [
        $page?.url.pathname,
        $navigating?.to?.url.pathname
      ].includes(link.url),
      isSubOrActive =
        (splitPath?.length > 1 && splitPath.indexOf(truePath) > 0) ||
        link.active;

    return isRoot ? 'root' : isSubOrActive ? 'sub' : 'nil';
  };

  $: (classNames = `active-${getActive()}`), $page.url, link.active;
</script>

<span class={classNames} />

<style lang="scss">
  span {
    @apply absolute transition-colors;
    top: -7%;
    bottom: -7%;
    right: -1px;
    width: 1px;
    height: 114%;

    &.active-root {
      @apply bg-violet-400;
      width: 2px;
    }
    &.active-sub {
      @apply bg-violet-400/80;
    }
  }

  :global(.dark) {
    span {
      &.active-root {
        @apply bg-violet-300;
      }
      &.active-sub {
        @apply bg-violet-300/80;
      }
    }
  }
</style>
