<script lang="ts">
  import { NAV_LINKS } from '$lib/consts';

  import LanguageControls from '$components/controls/language-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import NavLink from '$components/nav/header-link.svelte';

  export let scrollShadow: { top: boolean; bottom: boolean } | undefined;
</script>

<header
  class="flex flex-row flex-wrap items-center justify-start gap-x-6 border-b border-dark/80 px-6 py-4 transition-[border-color] dark:border-light/60"
  class:shadow-t={scrollShadow?.top}
>
  <div
    class="flex flex-1 flex-row flex-wrap items-center justify-between gap-x-3 gap-y-4"
  >
    <nav
      class="flex flex-col items-start justify-center gap-y-3 text-base transition-[color]"
      aria-label="Main navigation"
    >
      <div class="flex flex-row items-center justify-start gap-x-2.5 gap-y-1 font-mono">
        <span
          class="flex-shrink-0 select-none whitespace-nowrap text-base font-bold text-dark transition-colors dark:text-light"
          >kio.dev <span
            class="cursor-default select-none text-dark/60 dark:text-light/60"
            aria-hidden="true">/</span
          ></span
        >

        <span
          class="inline-flex select-none flex-row flex-wrap items-center justify-start gap-y-1 text-[13.5px] text-dark/80 dark:text-light/80 print:hidden"
        >
          {#each NAV_LINKS as link, i}
            <span>
              <NavLink {link} />{#if i < NAV_LINKS.length - 1}<span
                  class="cursor-default select-none text-dark/60 dark:text-light/60"
                  aria-hidden="true">,&nbsp;</span
                >
              {/if}
            </span>
          {/each}
        </span>
      </div>
    </nav>
    <div
      class="flex flex-row items-center justify-start gap-2 text-right text-dark dark:text-light md:gap-3 print:hidden"
      aria-label="Page controls"
      role="group"
    >
      <ThemeToggle />
      <LanguageControls />
    </div>
  </div>
</header>

<style lang="scss">
  @import '@styles/colors';
  @import '@styles/mixins';

  .shadow-t {
    box-shadow: 0 5px 0 0 rgba($dark, 0.1);
    z-index: 200;

    @include dark {
      box-shadow: 0 5px 0 0 rgba($light, 0.2);
    }
  }
</style>
