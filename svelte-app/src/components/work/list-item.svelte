<script lang="ts">
  import ListItemWrapper from '../list-item-wrapper.svelte';
  import { getAbsDate } from '$lib/helpers/date';
  import { onMount } from 'svelte';
  import { sounds } from '$stores/features';
  import type { Document } from '$lib/types';
  import type UIfx from 'uifx';

  export let project: Document;
  export let mousePos = [0, 0];

  let click: UIfx;

  let hovered = false;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });
</script>

<ListItemWrapper {hovered} {mousePos} wrapperClass="mt-6">
  {#if project}
    <a
      href="work/{project.slug && project.slug.current}"
      on:mouseenter={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
      on:click={() => $sounds === 'on' && click?.play()}
    >
      <section
        class="flex flex-col items-stretch justify-stretch w-full h-fit max-h-40 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
        data-test-id="list-item"
        on:focus={() => (hovered = true)}
        on:blur={() => (hovered = false)}
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
      class="flex flex-col items-stretch justify-stretch w-full h-fit max-h-40 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
      data-test-id="list-item"
      aria-label="No results"
    >
      <h3 class="text-center font-sans text-base my-2">No results found</h3>
    </section>
  {/if}
</ListItemWrapper>
