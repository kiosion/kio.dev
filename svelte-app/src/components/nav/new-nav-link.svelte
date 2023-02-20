<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import { page, navigating } from '$app/stores';
  import { t, isLocalized } from '$i18n';
  import { goto } from '$app/navigation';
  import SFX from '$lib/sfx';
  import NewLinkIndicator from '$components/nav/new-link-indicator.svelte';

  export let link: { name: string; url: string; active: boolean };

  $: splitPath = $page?.url.pathname.split('/') || [];
  $: truePath = link.url.slice($isLocalized ? 4 : 1);
  $: isActive =
    [$page?.url?.pathname, $navigating?.to?.url.pathname].includes(link.url) ||
    link.active ||
    (splitPath?.length > 1 && splitPath.indexOf(truePath) > 0);
</script>

<Hoverable bind:hovered={link.active}>
  <span class="relative flex w-full flex-row items-center justify-start">
    <a
      class="focusOutline-sm"
      class:active={isActive}
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
    <NewLinkIndicator {link} />
  </span>
</Hoverable>

<style lang="scss">
  a {
    @apply w-full rounded-[0.1rem] font-mono text-stone-600 transition-colors;

    &.active {
      @apply text-stone-800;
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
