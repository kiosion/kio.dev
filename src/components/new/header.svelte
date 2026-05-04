<script lang="ts">
  import { page } from '$app/state';
  import { BASE_DOMAIN, NAV_LINKS } from '$lib/consts';
  import { pathnameGroupKey } from '$lib/utils';

  type Crumb = { label: string; href?: string };

  const url = $derived(page.url?.pathname ?? '/');

  const breadcrumbs = $derived.by<Crumb[]>(() => {
    if (page.error) {
      return [
        { label: BASE_DOMAIN, href: '/' },
        { label: page.status === 404 ? 'Not Found' : 'Error' },
      ];
    }
    return (
      (page.data?.breadcrumbs as Crumb[] | undefined) ?? [
        { label: BASE_DOMAIN, href: '/' },
      ]
    );
  });

  const mobileBreadcrumbs = $derived.by<Crumb[]>(() => {
    const c = breadcrumbs;
    if (c.length <= 2) {
      return c;
    }

    const parent = c.at(-2);
    return [c[0], { label: '...', href: parent?.href }, c.at(-1)!];
  });
</script>

{#snippet navLink(href: string, text: string, active = false)}
  <a
    {href}
    class="underline decoration-2 underline-offset-[3px] transition-[text-decoration-color,opacity]"
    aria-current={active ? 'page' : undefined}
    aria-disabled={active}
    class:decoration-transparent={!active}
    class:decoration-orange-light={active}
    class:dark:decoration-orange-dark={active}
    class:select-none={active}
    class:pointer-events-none={active}
    class:opacity-100={active}
    class:opacity-70={!active}
    class:hover:decoration-orange-light={!active}
    class:hover:dark:decoration-orange-dark={!active}
    class:hover:opacity-100={!active}
    data-sveltekit-preload-code="eager"
    data-sveltekit-preload-data="eager"
  >
    {text}
  </a>
{/snippet}

{#snippet breadcrumbSegment(crumb: Crumb, isLast: boolean)}
  <svelte:element
    this={crumb.href && !isLast ? 'a' : 'span'}
    href={crumb.href && !isLast ? crumb.href : undefined}
    class="inline-block max-w-[24ch] min-w-0 truncate tracking-wide underline decoration-transparent decoration-2 underline-offset-[3px] transition-[text-decoration-color,opacity] md:max-w-[48ch]"
    class:hover:decoration-orange-light={!!crumb.href && !isLast}
    class:hover:dark:decoration-orange-dark={!!crumb.href && !isLast}
    class:opacity-70={!isLast}
    class:hover:opacity-100={crumb.href && !isLast}
    class:focus-visible:opacity-100={crumb.href && !isLast}
    aria-current={isLast ? 'page' : undefined}
    data-sveltekit-preload-code="eager"
    data-sveltekit-preload-data="eager"
  >
    {#if crumb.href === '/'}
      <span class="flex flex-row items-center gap-4">
        <span class="mb-0.5 shrink-0" aria-hidden="true">
          <img
            src="/assets/logo-standard--small.webp"
            class="size-6 shrink-0 transition-[filter] dark:invert"
            alt=""
          />
        </span>
        {#if !isLast}
          {crumb.label}
        {/if}
      </span>
    {:else}
      {crumb.label}
    {/if}
  </svelte:element>
{/snippet}

<header
  class="bg-light dark:bg-dark sticky top-0 z-10 border-b border-neutral-200 transition-colors dark:border-neutral-400"
>
  <div
    class="relative mx-auto flex w-full max-w-6xl flex-row items-center justify-between gap-6 px-8 py-6"
  >
    <!-- Breadcrumbs -->
    <nav class="min-w-0 select-none" aria-label="Breadcrumbs">
      <ol class="hidden min-w-0 items-center whitespace-nowrap md:flex">
        {#each breadcrumbs as crumb, i (crumb.href ?? `${i}:${crumb.label}`)}
          <li
            class="text-md flex min-w-0 items-center before:mx-2 before:opacity-70 before:content-['/'] first:before:content-none"
            class:shrink-0={i === 0 || crumb.label === '...'}
          >
            {@render breadcrumbSegment(crumb, i === breadcrumbs.length - 1)}
          </li>
        {/each}
      </ol>

      <ol class="flex min-w-0 items-center whitespace-nowrap md:hidden">
        <li class="text-md flex min-w-0 items-center">
          {@render breadcrumbSegment({ label: BASE_DOMAIN, href: '/' }, false)}
        </li>
      </ol>
    </nav>

    <!-- Right-side nav -->
    <div
      class="flex flex-row flex-wrap items-center justify-between gap-8 sm:justify-end"
    >
      <nav
        class="text-md flex flex-row items-center justify-start gap-x-4 tracking-wide sm:justify-end sm:gap-x-8"
        aria-label="Primary"
      >
        {#each NAV_LINKS as link}
          {@render navLink(link.url, link.name, link.url === pathnameGroupKey(url))}
        {/each}
      </nav>
    </div>
  </div>
</header>
