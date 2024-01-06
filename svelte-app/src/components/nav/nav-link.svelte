<script lang="ts">
  import { goto } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import { isLocalized, linkTo, t } from '$i18n';

  import Hoverable from '$components/hoverable.svelte';

  export let link: {
      name: string;
      url: string;
    },
    navigatingIsActive = false;

  let isHovered = false,
    isActive = false;

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

<Hoverable bind:hovered={isHovered}>
  <a
    class="focusOutline-sm no-select"
    class:active={isActive || isHovered}
    aria-current={isActive ? 'page' : undefined}
    aria-label={$t(link.name)}
    href={$linkTo(link.url)}
    tabindex="0"
    role="menuitem"
    data-sveltekit-preload-data
    data-sveltekit-preload-code
    on:click={handleAction}
    on:keydown={(e) => {
      if (e.code === 'Enter') {
        handleAction(e);
      }
    }}
  >
    {$t(link.name).toLowerCase()}
    <!-- {#if isActive || isHovered}
      <span
        class="absolute block rounded-md {isHovered
          ? 'bg-accent-light/60 dark:bg-accent-dark/60'
          : 'bg-accent-light dark:bg-accent-dark'} -bottom-1 left-0 right-0 h-[2px] transition-[background-color] md:bottom-2"
      />
    {/if} -->
  </a>
</Hoverable>

<style lang="scss">
  a {
    @apply rounded-sm text-sm text-dark/80 transition-[color];

    &:hover,
    &:focus-visible,
    &.active {
      @apply text-accent-light;
    }
  }

  :global(.dark) {
    a {
      @apply text-light/80;

      &:hover,
      &:focus-visible,
      &.active {
        @apply text-accent-dark;
      }
    }
  }
</style>
