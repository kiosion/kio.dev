<script lang="ts">
  import { page } from '$app/state';
  import { BASE_DOMAIN, NAV_LINKS } from '$lib/consts';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  const url = $derived(page?.url?.pathname);

  const linkMatches = (link: string) =>
    link === '/' ? url === link : url.startsWith(link);
</script>

{#snippet navLink(href: string, text: string, active = false)}
  <a
    {href}
    class="decoration-orange-light dark:decoration-orange-dark decoration-2 underline-offset-[3px] transition-opacity"
    aria-disabled={active}
    class:select-none={active}
    class:pointer-events-none={active}
    class:opacity-50={active}
    class:opacity-70={!active}
    class:hover:underline={!active}
    class:hover:opacity-100={!active}
    data-sveltekit-preload-code
    data-sveltekit-preload-data>{text}</a
  >
{/snippet}

<header
  class="border-dark dark:border-light bg-light/75 dark:bg-dark/75 sticky top-0 z-10 border-b backdrop-blur-md"
>
  <div
    class="relative isolate mx-auto flex w-full items-center justify-between gap-6 px-8 py-6"
  >
    <div class="flex flex-row items-center gap-x-4">
      <div class="flex flex-row items-center gap-x-2 select-none">
        <a
          class="text-md tracking-wide opacity-70"
          href="/"
          data-sveltekit-preload-code
          data-sveltekit-preload-data>{BASE_DOMAIN}</a
        >
        <span class="text-md opacity-70">/</span>
      </div>
      <div class="relative inline-grid grid-cols-[max-content] select-none">
        <span class="text-md invisible block tracking-wide"
          >{NAV_LINKS.reduce(
            (max, l) => (l.name.length > max.length ? l.name : max),
            ''
          )}</span
        >
        {#each NAV_LINKS as link}
          {#if linkMatches(link.url)}
            <p
              class="text-md decoration-orange-light dark:decoration-orange-dark absolute inset-0 tracking-wide underline decoration-2 underline-offset-4"
              in:fly={{ duration: 400, x: 150, delay: 250, easing: cubicOut }}
              out:fly={{ duration: 400, x: 150, easing: cubicIn }}
            >
              {link.name}
            </p>
          {/if}
        {/each}
      </div>
    </div>

    <nav class="text-md flex flex-row items-center justify-end gap-x-10 tracking-wide">
      {#each NAV_LINKS as link}
        {@render navLink(link.url, link.name, link.url === url)}
      {/each}
    </nav>
  </div>
</header>
