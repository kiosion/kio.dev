<script lang="ts">
  import ListItem from '$components/work/list-item.svelte';
  import PageHeading from '$components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { highlightEffects, sounds } from '$stores/features';
  import { projects } from '$stores/work';
  import ErrorText from '$components/error-text.svelte';
  import type { PageData } from './$types';
  import type UIfx from 'uifx';
  import IconHeader from '$components/icon-header.svelte';
  import { page } from '$app/stores';
  import { setupNavigation } from '$helpers/navigation';

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

  $: ({ pinnedProject } = data);
</script>

<svelte:head>
  <title>kio.dev | work</title>
</svelte:head>

<div data-test-route="work" class="w-full">
  <PageHeading
    heading="Work"
    text="A collection of my work, open-source contributions, and personal projects"
  />
  <div class="mb-12">
    {#if pinnedProject?.data}
      <IconHeader icon="Pin" text="Pinned" />
      <ListItem project={pinnedProject.data} {mousePos} />
    {/if}
    <IconHeader icon="Clock" text="Recent" />
    {#if $projects?.data?.length}
      {#each $projects.data as project}
        <ListItem {project} {mousePos} />
      {/each}
    {:else}
      <div class="w-full flex flex-row items-center justify-center">
        <ErrorText text="No data" classes="w-fit" />
      </div>
    {/if}
    <a
      href="/work/all"
      class="block w-fit mt-8 hover-target"
      aria-label="View all projects"
      on:click={() => $sounds === 'on' && click?.play()}
    >
      <IconHeader icon="ArrowRight" text="View all" classes="" />
    </a>
  </div>
</div>
