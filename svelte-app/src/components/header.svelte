<script lang="ts">
  import { NAV_LINKS } from '$lib/consts';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import NavLink from '$components/nav/header-link.svelte';
  import HeaderLogo from '$components/nav/header-logo.svelte';
</script>

<header
  class="flex flex-row flex-wrap items-center justify-between border-b border-dark/80 px-7 py-5 transition-[border-color] dark:border-light/60"
>
  <nav
    class="flex flex-row items-center justify-start gap-4 text-base transition-[color]"
    aria-label="Main navigation"
  >
    <HeaderLogo></HeaderLogo>
    <div class="flex flex-col items-start justify-start gap-y-0.5 font-mono">
      <span class="select-none text-base font-bold text-dark dark:text-light"
        >kio.dev</span
      >
      <div
        class="flex select-none flex-row items-center justify-start gap-x-1.5 text-[13.5px] text-dark/80 dark:text-light/80 print:hidden"
      >
        {#each NAV_LINKS as link, i}
          <NavLink {link}></NavLink>
          {#if i < NAV_LINKS.length - 1}
            <span
              class="cursor-default select-none text-dark/60 dark:text-light/60"
              aria-hidden="true">/</span
            >
          {/if}
        {/each}
      </div>
    </div>
  </nav>
  <div
    class="flex flex-row items-center justify-end gap-x-4 text-dark dark:text-light print:hidden"
    aria-label="Page controls"
    role="group"
  >
    <ThemeToggle></ThemeToggle>
    <LanguageControls></LanguageControls>
  </div>
</header>
