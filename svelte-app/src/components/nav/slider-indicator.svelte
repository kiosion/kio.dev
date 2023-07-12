<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';

  import { useMediaQuery } from 'svelte-breakpoints';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { isLocalized } from '$i18n';
  import { BASE_ANIMATION_DURATION, DEFAULT_DESKTOP_BREAKPOINT } from '$lib/consts';
  import { navLinks } from '$stores/navigation';

  export let container: HTMLElement,
    showHoverState = false;

  const topValue = tweened(0, {
      duration: 350,
      easing: cubicOut
    }),
    heightValue = tweened(0, {
      duration: 350,
      easing: cubicOut
    });

  let activeSizeOffset = -6,
    hoverSizeOffset = -12,
    normalSizeOffset = -20,
    isDesktop = useMediaQuery(DEFAULT_DESKTOP_BREAKPOINT),
    containerBoundingRect = container?.getBoundingClientRect();

  const getTrueLinkUrl = (url: string) => {
    return url.slice($isLocalized ? 4 : 1);
  };

  const getActiveLink = () => {
    if (showHoverState) {
      const hoveredLink = $navLinks.find((link) => link.hovered);

      if (hoveredLink) {
        return { status: 'hover' as const, link: hoveredLink };
      }
    }

    const activeLink = $navLinks.find((link) => link.active);

    if (activeLink) {
      const isRoot = truePageUrl === getTrueLinkUrl(activeLink.url);
      return {
        status: isRoot ? ('root' as const) : ('sub' as const),
        link: activeLink
      };
    }

    return null;
  };

  const setPositionalClassNames = async () => {
    if (!browser || !containerBoundingRect) {
      return;
    }

    const { status, link } = getActiveLink() || {};

    const linkElement = container?.querySelector(
      `a[href="${link?.url}"]`
    ) satisfies HTMLAnchorElement | null;

    if (!linkElement) {
      return;
    }

    let { top, height } = linkElement.getBoundingClientRect();
    // Accounting for container's top voffset
    top -= containerBoundingRect.top;

    await new Promise((resolve) => setTimeout(resolve, BASE_ANIMATION_DURATION / 2));

    switch (status) {
      case 'hover':
        topValue.set(top - hoverSizeOffset / 2);
        heightValue.set(height + hoverSizeOffset);
        break;
      case 'root':
        topValue.set(top - activeSizeOffset / 2);
        heightValue.set(height + activeSizeOffset);
        break;
      case 'sub':
        topValue.set(top - normalSizeOffset / 2);
        heightValue.set(height + normalSizeOffset);
        break;
    }
  };

  $: truePageUrl = getTrueLinkUrl($page?.url.pathname);
  $: setTimeout(() => (containerBoundingRect = container?.getBoundingClientRect()), 50),
    $isDesktop;
  $: setPositionalClassNames(), containerBoundingRect, $page?.url, $navLinks;
  $: isHoveringLink = showHoverState && $navLinks.some((link) => link.hovered);
</script>

<span
  class:hovered={isHoveringLink}
  style="top: {$topValue}px; height: {$heightValue}px; width: 2px;"
/>

<style lang="scss">
  span {
    @apply absolute bg-accent-light  transition-colors duration-150;
    right: -1px;

    &.hovered {
      @apply bg-accent-light/70;
    }
  }

  :global(.dark) {
    span {
      @apply bg-accent-dark;

      &.hovered {
        @apply bg-accent-dark/70;
      }
    }
  }
</style>
