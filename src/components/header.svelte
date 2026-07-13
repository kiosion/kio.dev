<script lang="ts">
  import { page } from '$app/state';
  import { BASE_DOMAIN, NAV_LINKS } from '$lib/consts';
  import { crumbFade } from '$lib/transitions';
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
</script>

{#snippet navLink(href: string, text: string, active = false)}
  <a
    {href}
    class="-mx-2 -my-2 px-2 py-2 underline decoration-2 underline-offset-[3px] transition-[text-decoration-color,opacity]"
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
    class:focus-visible:decoration-orange-light={!active}
    class:focus-visible:dark:decoration-orange-dark={!active}
    class:focus-visible:opacity-100={!active}
    class:active:decoration-orange-light={!active}
    class:active:dark:decoration-orange-dark={!active}
    class:active:opacity-50={!active}
  >
    {text}
  </a>
{/snippet}

{#snippet crumbLabel(text: string, linky: boolean)}
  <!-- Underline lives on this inner span: text-decoration doesn't propagate
       into the home crumb's flex wrapper, and it keeps the logo underline-free. -->
  <span
    class="underline decoration-transparent decoration-2 underline-offset-[3px] transition-[text-decoration-color]"
    class:group-hover:decoration-orange-light={linky}
    class:group-hover:dark:decoration-orange-dark={linky}
    class:group-focus-visible:decoration-orange-light={linky}
    class:group-focus-visible:dark:decoration-orange-dark={linky}
    class:group-active:decoration-orange-light={linky}
    class:group-active:dark:decoration-orange-dark={linky}>{text}</span
  >
{/snippet}

{#snippet breadcrumbSegment(crumb: Crumb, isLast: boolean)}
  <svelte:element
    this={crumb.href && !isLast ? 'a' : 'span'}
    href={crumb.href && !isLast ? crumb.href : undefined}
    class="group inline-block max-w-[24ch] min-w-0 truncate tracking-wide transition-opacity md:max-w-[48ch]"
    class:opacity-70={!isLast}
    class:hover:opacity-100={crumb.href && !isLast}
    class:active:opacity-50={crumb.href && !isLast}
    class:focus-visible:opacity-100={crumb.href && !isLast}
    aria-current={isLast ? 'page' : undefined}
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
        {@render crumbLabel(crumb.label, !isLast)}
      </span>
    {:else}
      {@render crumbLabel(crumb.label, !!crumb.href && !isLast)}
    {/if}
  </svelte:element>
{/snippet}

<header class="site-header sticky top-0 z-10">
  <div
    class="relative mx-auto flex w-full max-w-6xl flex-row items-center justify-between gap-6 px-8 py-6"
  >
    <!-- Breadcrumbs -->
    <nav class="min-w-0 select-none" aria-label="Breadcrumbs">
      <ol class="hidden min-w-0 items-center whitespace-nowrap md:flex">
        <!-- Keyed per segment: unchanged crumbs hold still; a segment that
             enters/leaves fades while its width collapses, so neighbours
             slide instead of jumping. -->
        {#each breadcrumbs as crumb, i (crumb.href ?? `${i}:${crumb.label}`)}
          <li
            class="text-md flex min-w-0 items-center before:mx-2 before:opacity-70 before:content-['/'] first:before:content-none"
            class:shrink-0={i === 0 || crumb.label === '...'}
            transition:crumbFade
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
