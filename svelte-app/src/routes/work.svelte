<script lang="ts" context="module">
  import { projects, findProjects } from '@/stores/work';
  import Logger from '@/lib/logger';

  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    await findProjects(fetch)
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        projects.set(res);
      })
      .catch((err: unknown) => {
        Logger.error(err as string, 'routes/work');
      });
  };
</script>

<script lang="ts">
  import ListItem from '@/components/work/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { highlightEffects } from '@/stores/features';

  let mousePos: number[];

  onMount(() => {
    $highlightEffects === 'on' &&
      document.addEventListener('mousemove', (e) => {
        mousePos = [e.clientX, e.clientY];
      });
  });

  onDestroy(() => {
    $highlightEffects === 'on' &&
      document.removeEventListener('mousemove', (e) => {
        mousePos = [e.clientX, e.clientY];
      });
  });
</script>

<svelte:head>
  <title>kio.dev | work</title>
</svelte:head>

<div data-test-route="work" class="w-full">
  <PageHeading
    title="work"
    subtitle="A collection of recent work and projects of mine"
  />
  <div class="mt-2">
    {#if $projects?.data?.length}
      {#each $projects.data as project}
        <ListItem {project} {mousePos} />
      {/each}
    {:else}
      <p>No projects found.</p>
    {/if}
  </div>
</div>
