<script lang="ts">
  import { NAV_LINKS } from '$lib/consts';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import NavLink from '$components/nav/header-link.svelte';
  import HeaderLogo from '$components/nav/header-logo.svelte';
</script>

<header
  class="flex flex-row flex-wrap items-center justify-between gap-y-3 border-b border-dark/80 px-7 py-5 transition-[border-color] dark:border-light/60"
>
  <nav
    class="flex flex-row items-center justify-start gap-5 text-base text-dark/90 transition-[color] dark:text-light/90"
    aria-label="Main navigation"
  >
    <HeaderLogo />
    <div class="mt-1 flex flex-col items-start justify-start gap-2.5 font-mono">
      <span class="select-none text-base font-bold">kio.dev</span>
      <div
        class="text-md flex select-none flex-row items-center justify-start gap-2 text-dark/80 dark:text-light/80 print:hidden"
      >
        {#each NAV_LINKS as link, i}
          <NavLink {link} />
          {#if i < NAV_LINKS.length - 1}
            <span
              class="cursor-default select-none text-sm text-dark/60 dark:text-light/60"
              aria-hidden="true">/</span
            >
          {/if}
        {/each}
      </div>
    </div>
  </nav>
  <div
    class="flex flex-row items-center justify-end gap-x-4 text-dark/80 dark:text-light/80 print:hidden"
    aria-label="Page controls"
    role="group"
  >
    <ThemeToggle />
    <LanguageControls />
  </div>
</header>
