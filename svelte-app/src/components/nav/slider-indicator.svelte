<script lang="ts">
  import { page } from '$app/stores';
  import { isLocalized } from '$i18n';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { browser } from '$app/environment';
  import { navLinks } from '$stores/navigation';

  export let container: HTMLElement;

  const topValue = tweened(0, {
      duration: 350,
      easing: cubicOut
    }),
    heightValue = tweened(0, {
      duration: 350,
      easing: cubicOut
    });

  const activeSizeOffset = -4,
    hoverSizeOffset = -12,
    normalSizeOffset = -22;

  const getTrueLinkUrl = (url: string) => {
    return url.slice($isLocalized ? 4 : 1);
  };

  const getActiveLink = () => {
    const hoveredLink = $navLinks.find((link) => link.hovered);

    if (hoveredLink) {
      return { status: 'hover' as const, link: hoveredLink };
    }

    const activeLink = $navLinks.find((link) => link.active);

    if (activeLink) {
      const isRoot = truePageUrl === getTrueLinkUrl(activeLink.url);
      return {
        status: isRoot ? ('root' as const) : ('sub' as const),
        link: activeLink
      };
    }

    // const fbActiveLink =
    //   $navLinks.find((link) => {
    //     return (
    //       getTrueLinkUrl(link.url) !== '' &&
    //       truePageUrl.startsWith(getTrueLinkUrl(link.url))
    //     );
    //   }) || $navLinks.find((link) => getTrueLinkUrl(link.url) === '');

    // if (fbActiveLink) {
    //   const isRoot = truePageUrl === getTrueLinkUrl(fbActiveLink.url);
    //   return { status: isRoot ? 'root' : 'sub', link: fbActiveLink };
    // }

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
  $: containerBoundingRect = container?.getBoundingClientRect();
  $: setPositionalClassNames(), container, $page?.url, $navLinks;
  $: isHoveringLink = $navLinks.some((link) => link.hovered);
</script>

<span
  class:hovered={isHoveringLink}
  style="top: {$topValue}px; height: {$heightValue}px; width: 2px;"
/>

<style lang="scss">
  span {
    @apply absolute bg-violet-400  transition-colors;
    right: -1px;

    &.hovered {
      @apply bg-violet-400/70;
    }
  }

  :global(.dark) {
    span {
      @apply bg-violet-300;

      &.hovered {
        @apply bg-violet-300/70;
      }
    }
  }
</style>
