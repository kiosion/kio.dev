<script lang="ts" context="module">
  import { projects, findProjects } from '@/stores/work';
  import Logger from '@/lib/logger';

  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    await findProjects(fetch)
      .then((res) => {
        if (res.error) {
          return;
        }
        projects.set(res?.data);
      })
      .catch((err: any) => {
        Logger.error(err, 'routes/work');
      });
  };
</script>

<script lang="ts">
  import ListItem from '@/components/work/list-item.svelte';
  import PageHeading from '@/components/headings/page-heading.svelte';
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
    {#if $projects && $projects.length}
      {#each $projects as project}
        <ListItem {project} />
      {/each}
    {:else}
      <ListItem />
    {/if}
  </div>
</div>
