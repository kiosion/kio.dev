<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import { page, navigating } from '$app/stores';
  import { t, isLocalized } from '$i18n';
  import { goto } from '$app/navigation';
  import SFX from '$lib/sfx';
  import { navLinks } from '$stores/navigation';

  export let link: {
      name: string;
      url: string;
      active: boolean;
      hovered: boolean;
    },
    index: number,
    navigatingIsActive = false;

  let isHovered = false;

  const updateActive = () => {
      $navLinks[index].active !== isActive &&
        navLinks.update((links) => ((links[index].active = isActive), links));
    },
    updateHovered = () => {
      $navLinks[index].hovered !== isHovered &&
        navLinks.update((links) => ((links[index].hovered = isHovered), links));
    };

  $: splitPath = $page?.url.pathname.split('/') || [];
  $: truePath = link.url.slice($isLocalized ? 4 : 1);
  $: isActive = (() => {
    let urlIncludesLink = $page?.url.pathname === link.url;

    if (navigatingIsActive) {
      urlIncludesLink ||= $navigating?.to?.url.pathname === link.url;
    }

    return (
      urlIncludesLink ||
      (splitPath?.length > 1 && splitPath.indexOf(truePath) > 0)
    );
  })();
  $: updateActive(), isActive;
  $: updateHovered(), isHovered;
</script>

<Hoverable bind:hovered={isHovered}>
  <a
    class="focusOutline-sm"
    class:active={isActive || link.hovered}
    class:first={index === 0}
    aria-label={t(link.name)}
    href={link.url}
    role="menuitem"
    tabindex="0"
    data-sveltekit-preload-data
    data-sveltekit-preload-code
    on:click={() => {
      SFX.click.play();
    }}
    on:keydown={(e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        SFX.click.play();
        goto(link.url);
      }
    }}
  >
    {t(link.name)}
  </a>
</Hoverable>

<style lang="scss">
  a {
    @apply w-full rounded-[0.1rem] py-3 font-mono text-stone-600 transition-colors;

    &.active {
      @apply text-stone-800;
    }
    &.first {
      @apply -mt-2;
    }
  }

  :global(.dark) {
    a {
      @apply text-stone-300;

      &.active {
        @apply text-stone-100;
      }
    }
  }
</style>
