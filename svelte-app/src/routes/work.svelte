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

<svelte:head>
  <title>kio.dev | work</title>
</svelte:head>

<div data-test-route="work">
  <h1 class="font-code font-bold text-4xl text-center my-8 lowercase">work</h1>
  <p class="text-center">Recent work and projects of mine</p>
  <div class="mt-2">
    <div
      class="w-full max-w-[28rem] px-4 mx-auto md:px-0 md:max-w-none md:w-[24rem] lg:w-[32rem] xl:w-[38rem] 2xl:w-[42rem]"
    >
      {#if $projects}
        <div />
      {:else}
        <p>Error loading</p>
      {/if}
    </div>
  </div>
</div>
