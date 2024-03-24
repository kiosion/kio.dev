<script lang="ts">
  import { NAV_LINKS } from '$lib/consts';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Divider from '$components/divider.svelte';
  import NavLink from '$components/nav/header-link.svelte';
  import HeaderLogo from '$components/nav/header-logo.svelte';
</script>

<header class="flex flex-row flex-wrap items-center justify-between gap-y-3 font-mono">
  <nav
    class="flex flex-row items-center justify-start gap-5 text-base text-dark/90 dark:text-light/90"
    aria-label="Main navigation"
  >
    <HeaderLogo />
    <div
      class="mt-0.5 flex flex-row items-center justify-start gap-2 text-dark/80 dark:text-light/80"
    >
      {#each NAV_LINKS as link, i}
        <NavLink {link} />
        {#if i < NAV_LINKS.length - 1}
          <span class="cursor-default select-none" aria-hidden="true">/</span>
        {/if}
      {/each}
    </div>
  </nav>
  <div
    class="mt-0.5 flex flex-row items-center justify-end gap-x-4 text-dark/80 dark:text-light/80"
    aria-label="Page controls"
    role="group"
  >
    <ThemeToggle />
    <LanguageControls />
  </div>
</header>
<Divider />
