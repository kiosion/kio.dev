<script lang="ts">
  import ListItem from '@/components/work/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { highlightEffects } from '@/stores/features';
  import { projects } from '@/stores/work';
  import { navOptions, pageHeading } from '@/stores/menu';
  import ErrorText from '@/components/error-text.svelte';

  let mousePos: [number, number];

  const setMousePos = (x: number, y: number) => {
    mousePos = [x, y];
  };

  onMount(() => {
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
</script>

<svelte:head>
  <title>kio.dev | work</title>
</svelte:head>

<div data-test-route="work" class="w-full">
  <PageHeading heading="A collection of recent work and projects of mine" />
  <div class="mb-12">
    <h3 class="font-code text-lg mt-4 mb-2">Pinned</h3>

    <h3 class="font-code text-lg mt-4 mb-2">Recent</h3>
    {#if $projects?.data?.length}
      {#each $projects.data as project}
        <ListItem {project} {mousePos} />
      {/each}
    {:else}
      <ErrorText text="No data" classes="w-fit" />
    {/if}
    <div class="w-full flex flex-row items-center justify-center mt-8">
      <a href="/work/all" class="w-fit" aria-label="View all projects">
        <h3 class="font-code text-lg w-fit" tabindex="0">View all</h3>
      </a>
    </div>
  </div>
</div>
