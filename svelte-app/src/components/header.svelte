<script lang="ts">
  import { NAV_LINKS } from '$lib/consts';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Divider from '$components/divider.svelte';
  import NavLink from '$components/nav/header-link.svelte';
  import HeaderLogo from '$components/nav/header-logo.svelte';
</script>

<header>
  <nav aria-label="Main navigation">
    <HeaderLogo />
    <div>
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
    @apply flex flex-row flex-wrap items-center justify-between gap-y-3 font-mono;
  }

  nav {
    @apply flex flex-row items-center justify-start gap-5 text-base text-dark/90;

    div {
      @apply justify-start gap-2 pr-0;
    }

    @include dark {
      @apply text-light/90;
    }
  }

  div {
    @apply flex flex-row items-center justify-end gap-5 pr-1.5 pt-0.5 text-dark/80;

    @include dark {
      @apply text-light/80;
    }
  }

  span {
    @apply cursor-default select-none;
  }
</style>
