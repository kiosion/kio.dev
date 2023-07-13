<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';

  import { useMediaQuery } from 'svelte-breakpoints';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { isLocalized } from '$i18n';
  import { BASE_ANIMATION_DURATION, DEFAULT_DESKTOP_BREAKPOINT } from '$lib/consts';
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

  let activeSizeOffset = -6,
    normalSizeOffset = -20,
    isDesktop = useMediaQuery(DEFAULT_DESKTOP_BREAKPOINT),
    containerBoundingRect = container?.getBoundingClientRect();

  const getTrueLinkUrl = (url: string) => {
    return url.slice($isLocalized ? 4 : 1);
  };

  const getActiveLink = () => {
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
</script>

<span style="top: {$topValue}px; height: {$heightValue}px; width: 2px;" />

<style lang="scss">
  span {
    @apply absolute bg-accent-light  transition-colors duration-150;
    right: -1px;
  }

  :global(.dark) {
    span {
      @apply bg-accent-dark;
    }
  }
</style>
