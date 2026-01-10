<script lang="ts">
  import { page } from '$app/state';
  import AboutContent from '$components/pages/about-content.svelte';
  import BlogContent from '$components/pages/blog-content.svelte';
  import HomeContent from '$components/pages/home-content.svelte';
  import ThemeToggle from '$components/theme-toggle.svelte';
  import ContentPreview from '$components/tooltips/content-preview.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { APP_ROUTES, BASE_DOMAIN, NAV_LINKS } from '$lib/consts';
  import type { ThemeChoice } from '$lib/theme';
  import { pathnameGroupKey } from '$lib/utils';
  import type {
    GetConfigQueryResult,
    GetPostsQueryResult,
  } from '$types/generated/sanity.types';
  import { flip } from 'svelte/animate';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  let {
    theme,
    setTheme,
    config,
    posts,
  }: {
    theme: ThemeChoice;
    setTheme: (t: ThemeChoice) => void;
    config: NonNullable<GetConfigQueryResult>;
    posts: NonNullable<GetPostsQueryResult>;
  } = $props();

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

  $inspect({ posts });
</script>

{#snippet navLink(href: string, text: string, active = false)}
  {#snippet navLinkTooltip()}
    <ContentPreview header={text}>
      {#if href === APP_ROUTES.find((r) => r.name === 'Home')?.path}
        <HomeContent {config} {posts} />
      {:else if href === APP_ROUTES.find((r) => r.name === 'Thoughts')?.path}
        <BlogContent
          {posts}
          tags={posts.reduce(
            (prev, cur) => {
              (cur.tags ?? []).forEach((t) => {
                if (!prev.some((pt) => pt.slug.current === t.slug.current)) {
                  prev.push(t);
                }
              });
              return prev;
            },
            [] as NonNullable<(typeof posts)[number]['tags']>,
          )}
          filter={false}
        />
      {:else if href === APP_ROUTES.find((r) => r.name === 'Etc')?.path}
        <AboutContent {config} />
      {/if}
    </ContentPreview>
  {/snippet}

  <Tooltip
    content={navLinkTooltip}
    delay={[250, 0]}
    offset={[2, 8]}
    duration={250}
    placement="bottom-start"
  >
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
      data-sveltekit-preload-data="hover"
    >
      {text}
    </a>
  </Tooltip>
{/snippet}

{#snippet breadcrumbSegment(crumb: Crumb, isLast: boolean)}
  <svelte:element
    this={crumb.href && !isLast ? 'a' : 'span'}
    href={crumb.href && !isLast ? crumb.href : undefined}
    class="inline-block max-w-[18ch] min-w-0 truncate tracking-wide underline decoration-transparent decoration-2 underline-offset-[3px] transition-[text-decoration-color,opacity] sm:max-w-[34ch]"
    class:hover:decoration-orange-light={!!crumb.href && !isLast}
    class:hover:dark:decoration-orange-dark={!!crumb.href && !isLast}
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
  class="bg-light dark:bg-dark sticky top-0 z-10 border-b border-neutral-300 transition-colors dark:border-neutral-400"
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
    <div
      class="flex flex-row flex-wrap items-center justify-between gap-8 sm:justify-end"
    >
      <nav
        class="text-md flex flex-row items-center justify-start gap-x-4 tracking-wide sm:justify-end sm:gap-x-8"
      >
        {#each NAV_LINKS as link}
          {@render navLink(link.url, link.name, link.url === pathnameGroupKey(url))}
        {/each}
      </nav>
      <ThemeToggle {theme} {setTheme} />
    </div>
  </div>
</header>
