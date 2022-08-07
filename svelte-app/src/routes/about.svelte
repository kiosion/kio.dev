<script lang="ts" context="module">
  import { about, findAbout } from '@/stores/about';
  import Logger from '$lib/logger';
  import PortableText from '@/components/portable-text/portable-text.svelte';

  export const load: import('@sveltejs/kit').Load = async ({ fetch }) => {
    await findAbout(fetch)
      .then((res) => {
        if (res.error) {
          return;
        }
        about.set(res?.data);
      })
      .catch((err: any) => {
        Logger.error(err, 'routes/about');
      });
  };
</script>

<svelte:head>
  <title>kio.dev | about</title>
</svelte:head>

<div data-test-route="about" class="w-full">
  <h1 class="font-code font-bold text-4xl text-center my-8 lowercase">about</h1>
  <p class="text-center">A little blurb about me</p>
  <div class="mt-8">
    <div
      class="w-full max-w-[28rem] px-4 mx-auto md:px-0 md:max-w-none md:w-[24rem] lg:w-[32rem] xl:w-[38rem] 2xl:w-[42rem]"
    >
      {#if $about}
        <div>
          <PortableText text={$about.body} />
        </div>
      {:else}
        <p>Error loading</p>
      {/if}
    </div>
  </div>
</div>
