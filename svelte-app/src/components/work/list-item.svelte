<script lang="ts">
  // import type { Project } from '@/lib/types';
  import { getAbsDate } from '$lib/helpers/date';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let project: any | null = null;
</script>

<section
  class="flex flex-col align-center justify-center w-full h-32 mt-6 p-4 bg-slate-200 dark:bg-slate-900 rounded duration-150"
  data-test-id="list-item"
>
  {#if project}
    <a href="work/{project.slug && project.slug.current}">
      <h1
        class="block overflow-hidden whitespace-nowrap w-full text-ellipsis font-display font-bold text-lg"
      >
        {project.title}
      </h1>
      <h3 class="font-sans text-base mt-2">
        {getAbsDate(project.date)}
      </h3>
      {#if project.desc}
        <p
          class="block overflow-hidden whitespace-nowrap w-full pr-6 text-ellipsis font-sans text-base mt-2 line-clamp-1"
        >
          {project.desc}
        </p>
      {/if}
    </a>
  {:else}
    <p class="text-center text-base w-full self-center">No projects found</p>
  {/if}
</section>
