<script lang="ts">
  import { fade } from 'svelte/transition';

  import { goto } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import { isLocalized, linkTo, t } from '$i18n';
  import { navOpen } from '$stores/navigation';

  import Hoverable from '$components/hoverable.svelte';

  export let link: {
      name: string;
      url: string;
    },
    links: {
      name: string;
      url: string;
    }[],
    index: number,
    mobile = false,
    navigatingIsActive = false;

  let isHovered = false,
    isActive = false;

  const handleAction = (e: Event) => {
    e.preventDefault();
    if ($page?.url.pathname.slice($isLocalized ? 3 : 0) === link.url) {
      return;
    }
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
</script>

<Hoverable bind:hovered={isHovered}>
  <a
    class="focusOutline-sm no-select"
    class:mobile
    class:first={index === 0}
    class:last={index === links.length - 1}
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
      if (e.code === 'Enter' || e.code === 'Space') {
        handleAction(e);
      }
    }}
  >
    <span>{$t(link.name)}</span>
    {#if mobile && (isActive || isHovered)}
      <span
        class="indicator"
        class:hovered={isHovered}
        transition:fade={{ duration: 100 }}
      />
    {/if}
  </a>
</Hoverable>

<style lang="scss">
  a {
    @apply relative w-full whitespace-nowrap rounded-[0.1rem] py-3 font-mono text-base text-dark/80 transition-[color];

    &.active {
      @apply text-dark;
    }
    &.mobile {
      @apply -ml-1 w-fit;

      &.first {
        @apply mt-4;
      }
      &.last {
        @apply mb-4;
      }
    }

    // span {
    //   @apply ml-9;
    // }
  }

  .indicator {
    @apply absolute rounded-full bg-accent-light transition-colors duration-150;
    width: 6px;
    height: 6px;
    // Account for font leading :/
    top: calc(50% + 1px);
    left: -14px;
    transform: translate(-50%, -50%);

    &.hovered {
      @apply bg-accent-light/60;
    }
  }

  :global(.dark) {
    a {
      @apply text-light/80;

      &.active {
        @apply text-light;
      }
    }

    .indicator {
      @apply bg-accent-dark;

      &.hovered {
        @apply bg-accent-dark/60;
      }
    }
  }
</style>
