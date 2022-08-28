<script lang="ts">
  import ListItem from '@/components/work/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { highlightEffects, sounds } from '@/stores/features';
  import { projects } from '@/stores/work';
  import { navOptions, pageHeading } from '@/stores/menu';
  import ErrorText from '@/components/error-text.svelte';
  import type { PageData } from './$types';
  import type UIfx from 'uifx';
  import IconHeader from '@/components/icon-header.svelte';
  import Pin from 'pixelarticons/svg/pin.svg';
  import Clock from 'pixelarticons/svg/clock.svg';
  import ArrowRight from 'pixelarticons/svg/arrow-right.svg';

  let mousePos: [number, number];

  const setMousePos = (x: number, y: number) => {
    mousePos = [x, y];
  };

  let click: UIfx;

  onMount(() => {
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

  navOptions.set({ down: '/about', up: '/blog' });
  pageHeading.set('Work');

  export let data: PageData;
</script>

<svelte:head>
  <title>kio.dev | work</title>
</svelte:head>

<div data-test-route="work" class="w-full">
  <PageHeading heading="A collection of recent work and projects of mine" />
  <div class="mb-12">
    {#if data.pinnedProject}
      <IconHeader icon={Pin} text="Pinned" />
      <ListItem post={data.pinnedProject.data} {mousePos} />
    {/if}
    <IconHeader icon={Clock} text="Recent" />
    {#if $projects?.data?.length}
      {#each $projects.data as project}
        <ListItem {project} {mousePos} />
      {/each}
    {:else}
      <ErrorText text="No data" classes="w-fit" />
    {/if}
    <a
      href="/work/all"
      class="block w-fit mt-8"
      aria-label="View all projects"
      on:click={() => $sounds === 'on' && click?.play()}
    >
      <IconHeader icon={ArrowRight} text="View all" classes="" />
    </a>
  </div>
</div>
