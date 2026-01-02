<script lang="ts">
  import { page } from '$app/state';
  import { BASE_DOMAIN, NAV_LINKS } from '$lib/consts';
  import { flip } from 'svelte/animate';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  type Crumb = { label: string; href?: string };

  const url = $derived(page.url?.pathname ?? '/');

  const breadcrumbs = $derived.by<Crumb[]>(() => {
    return (
      (page.data?.breadcrumbs as Crumb[] | undefined) ?? [
        { label: BASE_DOMAIN, href: '/' }
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
    class="decoration-orange-light dark:decoration-orange-dark decoration-2 underline-offset-[3px] transition-opacity"
    aria-current={active ? 'page' : undefined}
    aria-disabled={active}
    class:select-none={active}
    class:pointer-events-none={active}
    class:opacity-50={active}
    class:opacity-70={!active}
    class:underline={active}
    class:hover:underline={!active}
    class:hover:opacity-100={!active}
    data-sveltekit-preload-code="eager"
    data-sveltekit-preload-data="hover"
  >
    {text}
  </a>
{/snippet}

{#snippet breadcrumbSegment(crumb: Crumb, isLast: boolean)}
  <svelte:element
    this={crumb.href && !isLast ? 'a' : 'span'}
    href={crumb.href && !isLast ? crumb.href : undefined}
    class="decoration-orange-light dark:decoration-orange-dark inline-block max-w-[18ch] min-w-0 truncate tracking-wide decoration-2 underline-offset-[3px] transition-opacity sm:max-w-[34ch]"
    class:hover:underline={!!crumb.href && !isLast}
    class:opacity-70={!isLast}
    class:hover:opacity-100={crumb.href && !isLast}
    aria-current={isLast ? 'page' : undefined}
    in:fly={{ duration: 400, x: 150, delay: 100, easing: cubicOut }}
    out:fly={{ duration: 400, x: 150, easing: cubicIn }}
    data-sveltekit-preload-code="eager"
    data-sveltekit-preload-data="hover"
  >
    {crumb.label}
  </svelte:element>
{/snippet}

<header
  class="bg-light dark:bg-dark sticky top-0 z-10 border-b border-neutral-300 dark:border-neutral-400"
>
  <div
    class="relative isolate mx-auto grid w-full items-center gap-6 px-8 py-6 sm:grid-cols-[minmax(0,1fr)_max-content] sm:items-center sm:gap-y-0 sm:px-8 sm:py-6"
  >
    <!-- Breadcrumbs -->
    <nav aria-label="Breadcrumb" class="min-w-0 select-none">
      <ol class="hidden min-w-0 items-center whitespace-nowrap sm:flex">
        {#each breadcrumbs as crumb, i (crumb.href ?? `${i}:${crumb.label}`)}
          <li
            class="text-md flex min-w-0 items-center before:mx-2 before:opacity-70 before:content-['/'] first:before:content-none"
            animate:flip={{ duration: 250, easing: cubicOut }}
          >
            {#key crumb.label}
              {@render breadcrumbSegment(crumb, i === breadcrumbs.length - 1)}
            {/key}
          </li>
        {/each}
      </ol>

      <ol class="flex min-w-0 items-center whitespace-nowrap sm:hidden">
        {#each mobileBreadcrumbs as crumb, i (crumb.href ?? `${i}:${crumb.label}`)}
          <li
            class="text-md flex min-w-0 items-center before:mx-2 before:opacity-70 before:content-['/'] first:before:content-none"
            animate:flip={{ duration: 250, easing: cubicOut }}
          >
            {#key crumb.label}
              {@render breadcrumbSegment(crumb, i === mobileBreadcrumbs.length - 1)}
            {/key}
          </li>
        {/each}
      </ol>
    </nav>

    <!-- Right-side nav -->
    <nav
      class="text-md flex flex-row items-center justify-start gap-x-4 tracking-wide sm:justify-end sm:gap-x-8"
    >
      {#each NAV_LINKS as link}
        {@render navLink(link.url, link.name, link.url === url)}
      {/each}
    </nav>
  </div>
</header>
