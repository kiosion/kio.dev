<script lang="ts">
  import { goto } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import { isLocalized, linkTo, t } from '$lib/i18n';

  import type { NAV_LINKS } from '$lib/consts';

  export let link: (typeof NAV_LINKS)[number],
    navigatingIsActive = false;

  let isActive = false;

  const handleAction = (e: Event) => {
    e.preventDefault();
    if ($page?.url.pathname.slice($isLocalized ? 3 : 0) === link.url) {
      return;
    }
    goto($linkTo(link.url)).catch(() => undefined);
  };

  $: splitPath = $page?.url?.pathname?.split('/') || [];
  $: isActive = (() => {
    let urlIncludesLink =
      ($isLocalized ? $page?.url?.pathname?.slice(3) : $page?.url?.pathname) === link.url;

    if (navigatingIsActive) {
      urlIncludesLink ||= $navigating?.to?.url.pathname === link.url;
    }

    return (
      urlIncludesLink ||
      (splitPath?.length > 1 && splitPath.indexOf(link.url.slice(1)) > 0)
    );
  })();
</script>

<a
  href={link.url}
  class="focus-outline-sm -mx-2 block w-[calc(100%+16px)] rounded-lg px-3 py-1.5 text-md text-neutral-700 transition-colors dark:text-neutral-200"
  class:active={isActive}
  class:font-semibold={isActive}
  aria-current={isActive ? 'page' : undefined}
  data-sveltekit-preload-code
  on:click={handleAction}
  on:keydown={(e) => e.key === 'Enter' && handleAction(e)}
>
  {$t(link.name)}
</a>

<style lang="scss">
  @import '@styles/colors';
  @import '@styles/mixins';

  a {
    background-color: transparent;

    &:hover,
    &:focus-visible {
      background-color: rgba($neutral-200, 0.5);

      @include dark {
        background-color: rgba($neutral-700, 1);
      }
    }

    &.active {
      background-color: $neutral-200;

      @include dark {
        background-color: $neutral-800;
      }

      &:hover,
      &:focus-visible {
        background-color: rgba($neutral-200, 0.5);

        @include dark {
          background-color: rgba($neutral-700, 1);
        }
      }
    }
  }
</style>
