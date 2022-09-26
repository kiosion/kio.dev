<script lang="ts">
  import ListItem from '$components/work/list-item.svelte';
  import PageHeading from '$components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { highlightEffects, sounds } from '$stores/features';
  import ErrorText from '$components/error-text.svelte';
  import type { PageData } from './$types';
  import type UIfx from 'uifx';
  import IconHeader from '$components/icon-header.svelte';
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';
  import Hoverable from '$components/hoverable.svelte';
  import { RECENT_PROJECTS_COUNT } from '$lib/consts';

  let mousePos: [number, number];

  const setMousePos = (x: number, y: number) => {
    mousePos = [x, y];
  };

  let click: UIfx;

  onMount(() => {
    setupNavigation($page?.url?.pathname);

    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });

    if ($highlightEffects === 'on') {
      document.addEventListener('mousemove', (e) => {
        setMousePos(e.clientX, e.clientY);
      });
      document.addEventListener('mouseout', () => {
        setMousePos(-1000, -1000);
      });
      document.addEventListener('blur', () => {
        setMousePos(-1000, -1000);
      });
    }
  });

  onDestroy(() => {
    if ($highlightEffects === 'on') {
      document.removeEventListener('mousemove', () => setMousePos);
      document.removeEventListener('mouseout', () => setMousePos);
      document.removeEventListener('blur', () => setMousePos);
    }
  });

  export let data: PageData;

  $: ({ pinned, projects } = data);
</script>

<svelte:head>
  <title>kio.dev | work</title>
  <meta
    name="description"
    content="A collection of my work, open-source contributions, and personal projects"
  />
  <meta name="keywords" content="work, projects, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kio.dev/work" />
  <meta property="og:title" content="kio.dev | work" />
  <meta
    property="og:description"
    content="A collection of my work, open-source contributions, and personal projects"
  />
  <meta property="twitter:url" content="https://kio.dev/work" />
  <meta property="twitter:title" content="kio.dev | work" />
  <meta
    property="twitter:description"
    content="A collection of my work, open-source contributions, and personal projects"
  />
</svelte:head>

<div data-test-route="work" class="w-full">
  <PageHeading
    heading="Work"
    text="A collection of my work, open-source contributions, and personal projects"
  />
  <div class="mb-12">
    {#if pinned?.data}
      <IconHeader icon="Pin" text="Pinned" />
      <ListItem project={pinned.data} {mousePos} />
    {/if}
    <IconHeader icon="Clock" text="Recent" />
    {#if projects?.data?.length}
      {#each projects.data as project}
        <ListItem {project} {mousePos} />
      {/each}
    {:else}
      <div class="w-full flex flex-row items-center justify-center">
        <ErrorText text="No data" classes="w-fit" />
      </div>
    {/if}
    {#if projects?.meta?.total > RECENT_PROJECTS_COUNT}
      <Hoverable>
        <a
          href="/work/1"
          class="block w-fit mt-8"
          aria-label="View all projects"
          on:click={() => $sounds === 'on' && click?.play()}
        >
          <IconHeader icon="ArrowRight" text="View all" classes="" />
        </a>
      </Hoverable>
    {/if}
  </div>
</div>
