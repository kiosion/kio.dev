<script lang="ts">
  import { linkTo } from '$i18n';
  import { NAV_LINKS } from '$lib/consts';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Divider from '$components/divider.svelte';
  import NavLink from '$components/nav/header-link.svelte';
</script>

<header>
  <nav aria-label="Main navigation" role="group">
    <a href={$linkTo('/')} aria-label="Home">kio.dev</a>
    <div role="menu">
      {#each NAV_LINKS as link, i}
        <NavLink {link} />
        {#if i < NAV_LINKS.length - 1}
          <span aria-hidden="true">/</span>
        {/if}
      {/each}
    </div>
  </nav>
  <div aria-label="Page controls" role="group">
    <ThemeToggle />
    <LanguageControls />
  </div>
</header>
<Divider />

<style lang="scss">
  @import '@styles/mixins';

  header {
    @apply flex flex-row items-center justify-between font-mono;
  }

  nav {
    @apply flex flex-row items-center justify-start gap-5 text-base text-dark/90;

    div {
      @apply justify-start gap-2 pr-0;
    }
  }

  div {
    @apply flex flex-row items-center justify-end gap-5 pr-1.5 pt-0.5 text-dark/80;
  }

  a {
    @apply w-fit select-none rounded-sm font-code text-lg font-extrabold transition-[color];

    @include focus-state(sm);
  }

  span {
    @apply cursor-default select-none;
  }

  :global(.dark) {
    nav {
      @apply text-light/90;
    }

    div {
      @apply text-light/80;
    }

    a {
      @include focus-state(sm, dark);
    }
  }
</style>
