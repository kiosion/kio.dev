<script lang="ts">
  import { fade } from 'svelte/transition';

  import { goto } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import { isLocalized, t } from '$i18n';
  import SFX from '$lib/sfx';
  import { navLinks, navOpen } from '$stores/navigation';

  import Hoverable from '$components/hoverable.svelte';

  export let link: {
      name: string;
      url: string;
      active: boolean;
      hovered: boolean;
    },
    index: number,
    mobile = false,
    navigatingIsActive = false;

  let isHovered = false,
    isActive = false;

  const updateActive = () => {
      $navLinks[index].active !== isActive &&
        navLinks.update((links) => ((links[index].active = isActive), links));
    },
    updateHovered = () => {
      $navLinks[index].hovered !== isHovered &&
        navLinks.update((links) => ((links[index].hovered = isHovered), links));
    },
    handleAction = (e: Event) => {
      e.preventDefault();
      if ($page?.url.pathname.slice($isLocalized ? 3 : 0) === link.url) {
        return;
      }
      SFX.click.play();
      if (mobile) {
        navOpen.set(false);
      }
      goto(link.url).catch(() => undefined);
    };

  $: splitPath = $page?.url.pathname.split('/') || [];
  $: truePath = link.url.slice($isLocalized ? 4 : 1);
  $: (isActive = (() => {
    let urlIncludesLink = $page?.url.pathname === link.url;

    if (navigatingIsActive) {
      urlIncludesLink ||= $navigating?.to?.url.pathname === link.url;
    }

    return urlIncludesLink || (splitPath?.length > 1 && splitPath.indexOf(truePath) > 0);
  })()),
    navOpen;
  $: updateActive(), isActive;
  $: updateHovered(), isHovered;
</script>

<Hoverable bind:hovered={isHovered}>
  <a
    class="focusOutline-sm"
    class:mobile
    class:first={index === 0}
    class:last={index === $navLinks.length - 1}
    class:active={isActive || link.hovered}
    aria-label={$t(link.name)}
    href={link.url}
    role="menuitem"
    tabindex="0"
    data-sveltekit-preload-data
    data-sveltekit-preload-code
    on:click={handleAction}
    on:keydown={(e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        handleAction(e);
      }
    }}
  >
    <span>{$t(link.name)}</span>
    {#if mobile && (isActive || link.hovered)}
      <span
        class="indicator"
        class:hovered={link.hovered}
        transition:fade={{ duration: 100 }}
      />
    {/if}
  </a>
</Hoverable>

<style lang="scss">
  a {
    @apply relative w-full rounded-[0.1rem] py-3 font-mono text-base text-stone-600 transition-[color];

    &.active {
      @apply text-stone-800;
    }
    &.first {
      @apply -mt-2;
    }
    &.mobile {
      @apply -ml-10 w-fit;

      &.first {
        @apply mt-4;
      }
      &.last {
        @apply mb-4;
      }
    }

    span {
      @apply ml-9;
    }
  }

  .indicator {
    @apply absolute rounded-full bg-violet-400 transition-colors duration-150;
    width: 6px;
    height: 6px;
    // Account for font leading :/
    top: calc(50% + 1px);
    left: -14px;
    transform: translate(-50%, -50%);

    &.hovered {
      @apply bg-violet-400/60;
    }
  }

  :global(.dark) {
    a {
      @apply text-stone-300;

      &.active {
        @apply text-stone-100;
      }
    }

    .indicator {
      @apply bg-violet-300;

      &.hovered {
        @apply bg-violet-300/60;
      }
    }
  }
</style>
