<script lang="ts">
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { posts } from '@/stores/posts';
  import { projects } from '@/stores/work';
  import { onMount, onDestroy } from 'svelte';
  import { highlightEffects } from '@/stores/features';
  import ListItem from '@/components/index/list-item.svelte';

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
  <title>kio.dev | blog</title>
</svelte:head>

<div data-test-route="index" class="w-full">
  <PageHeading
    title="kio.dev"
    subtitle="Hello, I'm Kio - A full-stack developer, artist, and tech nerd from Canada."
  />
  <div class="flex flex-col items-center justify-center">
    <!-- Section for recent posts -->
    <div class="w-full mt-6">
      <h2 class="text-2xl font-bold">Recent Posts</h2>
      <div class="w-full flex flex-wrap 2xl:flex-nowrap gap-4 mt-4">
        <ListItem
          title="Hello, world!"
          desc="It's something (TM). Not really sure what else to say about it. It's a thing. It's real. So real. Unbelievably real. I can't even"
          {mousePos}
        />
        <ListItem
          title="Another filler post"
          desc="We're gonna need a bigger boat"
          {mousePos}
        />
      </div>
    </div>
    <!-- Section for recent projects -->
    <div class="w-full mt-6">
      <h2 class="text-2xl font-bold">Recent Projects</h2>
      <div class="w-full flex flex-wrap 2xl:flex-nowrap mt-4 gap-4 ">
        <div
          class="w-full min-w-[50%] flex p-4 bg-slate-200 dark:bg-slate-900 rounded-md"
        >
          <!-- <div class="flex items-center justify-center min-w-fit flex--1 mr-4">
            <img class="rounded-sm" src='https://via.placeholder.com/200x120' alt='Placeholder' />
          </div> -->
          <div class="flex flex-col">
            <h1 class="font-code font-bold text-xl">Project title</h1>
            <p
              class="overflow-hidden line-clamp-2 font-sans text-base my-2 mr-2"
            >
              Short description about the project here. What if I make it too
              long though?
            </p>
            <a
              href="/"
              class="font-sans text-base block hover:underline mt-auto"
              >See more</a
            >
          </div>
        </div>
        <div
          class="w-full min-w-[50%] flex p-4 bg-slate-200 dark:bg-slate-900 rounded-md"
        >
          <div class="flex flex-col">
            <h1 class="font-code font-bold text-xl">Another proj</h1>
            <p
              class="overflow-hidden line-clamp-2 font-sans text-base my-2 mr-2"
            >
              Wow, a project without a picture! So cool!
            </p>
            <a
              href="/"
              class="font-sans text-base block hover:underline mt-auto"
              >See more</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
