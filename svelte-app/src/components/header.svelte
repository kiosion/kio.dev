<script lang="ts">
  import { linkTo } from '$i18n';
  import { NAV_LINKS } from '$lib/consts';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Divider from '$components/divider.svelte';
  import NavLink from '$components/nav/nav-link.svelte';
</script>

<div class="flex flex-row items-center justify-between font-mono">
  <nav
    aria-label="Main navigation"
    role="group"
    class="flex flex-row items-center justify-start gap-5 text-base text-dark/90 dark:text-light/90"
  >
    <a
      class="focusOutline no-select w-fit rounded-sm font-code text-lg font-extrabold transition-[color]"
      href={$linkTo('/')}
      aria-label="Home"
    >
      kio.dev
    </a>
    <div
      class="flex flex-row items-center justify-start gap-2 rounded-md pt-0.5"
      role="menu"
    >
      {#each NAV_LINKS as link, i}
        <NavLink {link} />
        {#if i < NAV_LINKS.length - 1}
          /
        {/if}
      {/each}
    </div>
  </nav>
  <div
    aria-label="Page controls"
    role="group"
    class="flex flex-row items-center justify-end gap-5 pr-1.5 pt-0.5 text-dark/80 dark:text-light/80"
  >
    <ThemeToggle />
    <LanguageControls />
  </div>
</div>
<Divider />
