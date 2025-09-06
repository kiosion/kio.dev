<script lang="ts">
  import { page } from '$app/state';
  import { BASE_DOMAIN, NAV_LINKS } from '$lib/consts';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  const url = $derived(page.url?.pathname);
  const hasSlug = $derived(!!page.params?.slug && !!page.data?.post?.title);
  const postTitle = $derived.by<string | undefined>(() => {
    const baseTitle = page.data?.post?.title;
    return baseTitle
      ? baseTitle.length > 40
        ? `${baseTitle.slice(0, 40 - 3)}...`
        : baseTitle
      : undefined;
  });

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
            <svelte:element
              this={hasSlug ? 'a' : 'p'}
              href={hasSlug ? link.url : undefined}
              class="text-md decoration-orange-light dark:decoration-orange-dark absolute inset-0 tracking-wide decoration-2 underline-offset-[3px]"
              class:underline={!hasSlug}
              class:opacity-100={!hasSlug}
              class:opacity-70={hasSlug}
              in:fly={{ duration: 400, x: 150, delay: 250, easing: cubicOut }}
              out:fly={{ duration: 400, x: 150, easing: cubicIn }}
            >
              {link.name}
            </svelte:element>
          {/if}
        {/each}
      </div>
      {#if hasSlug}
        <span
          class="text-md opacity-70"
          in:fly={{ duration: 400, x: 150, delay: 250, easing: cubicOut }}
          out:fly={{ duration: 400, x: 150, easing: cubicIn }}>/</span
        >
        <p
          class="text-md decoration-orange-light dark:decoration-orange-dark tracking-wide underline decoration-2 underline-offset-[3px]"
          in:fly={{ duration: 400, x: 150, delay: 250, easing: cubicOut }}
          out:fly={{ duration: 400, x: 150, easing: cubicIn }}
        >
          {postTitle}
        </p>
      {/if}
    </div>

    <nav class="text-md flex flex-row items-center justify-end gap-x-10 tracking-wide">
      {#each NAV_LINKS as link}
        {@render navLink(link.url, link.name, link.url === url)}
      {/each}
    </nav>
  </div>
</header>
