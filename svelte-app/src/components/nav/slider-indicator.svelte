<script lang="ts">
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { isLocalized } from '$i18n';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
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
    normalSizeOffset = -20;

  const getTrueLinkUrl = (url: string) => {
    return url.slice($isLocalized ? 4 : 1);
  };

  const getActiveLinks = () => {
    const activeLink = $navLinks.find((link) => link.active);

    if (activeLink) {
      const isRoot = truePageUrl === getTrueLinkUrl(activeLink.url);
      return {
        status: isRoot ? ('root' as const) : ('sub' as const),
        active: activeLink,
        rest: $navLinks.slice(0, $navLinks.indexOf(activeLink)) || []
      };
    }

    return { status: 'root', active: null, rest: [] };
  };

  const setPositionalClassNames = async () => {
    if (!browser || !container) {
      return;
    }

    const { status, active, rest } = getActiveLinks() || {};

    const activeElement = active?.element,
      htmlElements = rest?.map((link) => link.element);

    if (!activeElement) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, BASE_ANIMATION_DURATION / 2));

    const top =
        htmlElements.reduce(
          (acc, link) => acc + (link?.getBoundingClientRect?.()?.height ?? 0),
          0
        ) -
        parseInt(
          window.getComputedStyle(activeElement).paddingTop.replace('px', '') ?? 0 / 2
        ) +
        // account for font-size, this whole file sucks but it works
        5,
      height = activeElement?.getBoundingClientRect?.()?.height ?? 0;

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
  $: setPositionalClassNames(), [container, truePageUrl, $navLinks];
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
