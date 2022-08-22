<script lang="ts">
  import ListItemWrapper from '../list-item-wrapper.svelte';
  import BulletPoint from '../bullet-point.svelte';
  import { getTotalWords } from '$lib/helpers/post';
  import { getAbsDate, getReadingTime } from '$lib/helpers/date';
  import type { Document } from '@/lib/types';
  import type { TextBlock } from '$lib/types';

  export let post: Document;
  export let mousePos = [0, 0];

  let hovered = false;
  let readingTime = getReadingTime(
    getTotalWords(post.body as Array<TextBlock>)
  );
</script>

<ListItemWrapper {hovered} {mousePos} wrapperClass="mt-6">
  {#if post}
    <a
      href="blog/{post.slug && post.slug.current}"
      on:mouseenter={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
    >
      <section
        class="flex flex-col items-stretch justify-stretch w-full h-fit max-h-40 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
        data-test-id="list-item"
      >
        <div
          class="flex flex-row flex-wrap items-center justify-start w-full mb-1"
        >
          <h3 class="inline-block w-fit font-sans text-base">
            {getAbsDate(post.date)}
          </h3>
          <BulletPoint />
          <h3 class="inline-block w-fit font-sans text-base">
            {`${Math.floor(readingTime / 60)} min read`}
          </h3>
        </div>
        <h1
          class="block overflow-hidden whitespace-nowrap w-full text-ellipsis font-display font-bold text-lg my-2"
        >
          {post.title}
        </h1>
        {#if post.desc}
          <div class="relative flex flex-row align-center justify-start my-1">
            <p
              class="overflow-hidden w-fit mr-4 text-ellipsis font-sans text-base line-clamp-1"
            >
              {post.desc}
            </p>
          </div>
        {/if}
      </section>
    </a>
  {:else}
    <section
      class="flex flex-col cursor-default items-stretch justify-stretch w-full h-32 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
      data-test-id="list-item"
    >
      <h3 class="text-center font-sans text-base my-2">No results found</h3>
    </section>
  {/if}
</ListItemWrapper>
