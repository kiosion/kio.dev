<script lang="ts">
  import ListItemWrapper from '../list-item-wrapper.svelte';
  import { getAbsDate } from '$lib/helpers/date';
  import type { Document } from '$lib/types';

  export let project: Document;
  export let mousePos = [0, 0];

  let hovered = false;
</script>

<ListItemWrapper {hovered} {mousePos} wrapperClass="mt-6">
  {#if project}
    <a
      href="work/{project.slug && project.slug.current}"
      on:mouseenter={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
    >
      <section
        class="flex flex-col align-center justify-center relative w-full h-32 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
        data-test-id="list-item"
        on:focus={() => (hovered = true)}
        on:blur={() => (hovered = false)}
        tabindex="0"
      >
        <h3 class="font-sans text-base mb-2">
          {getAbsDate(project.date)}
        </h3>
        <h1
          class="block overflow-hidden whitespace-nowrap w-full text-ellipsis font-display font-bold text-lg"
        >
          {project.title}
        </h1>
        {#if project.desc}
          <p
            class="block overflow-hidden whitespace-nowrap w-full pr-6 text-ellipsis font-sans text-base mt-1 line-clamp-1"
          >
            {project.desc}
          </p>
        {/if}
      </section>
    </a>
  {:else}
    <section
      class="flex flex-col cursor-default items-stretch justify-stretch w-full h-32 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
      data-test-id="list-item"
    >
      <div
        class="cover absolute top-0 left-0 w-full h-full pointer-events-none block bg-slate-400 {hovered
          ? 'opacity-10'
          : 'opacity-0'}"
      />
      <h3 class="text-center font-sans text-base my-2">No results found</h3>
    </section>
  {/if}
</ListItemWrapper>
