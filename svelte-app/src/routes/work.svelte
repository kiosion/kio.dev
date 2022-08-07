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
  import ListItem from '@/components/blog/list-item.svelte';
</script>

<svelte:head>
  <title>kio.dev | work</title>
</svelte:head>

<div data-test-route="work">
  <h1 class="font-code font-bold text-4xl text-center my-8 lowercase">work</h1>
  <p class="text-center">Recent work and projects of mine</p>
  <div class="mt-2">
    {#if $projects}
      {#each $projects as project}
        <div />
      {/each}
    {:else}
      <ListItem error="No projects found" />
    {/if}
  </div>
</div>
