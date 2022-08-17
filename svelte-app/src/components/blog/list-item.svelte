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

<ListItemWrapper {hovered} {mousePos}>
  {#if post}
    <a
      href="blog/{post.slug && post.slug.current}"
      on:mouseenter={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
    >
      <section
        class="flex flex-col items-stretch justify-stretch w-full h-fit max-h-32 p-4 bg-slate-200 dark:bg-slate-900 rounded-md duration-150"
        data-test-id="list-item"
      >
        <div
          class="cover absolute top-0 left-0 w-full h-full pointer-events-none block bg-slate-400 {hovered
            ? 'opacity-10'
            : 'opacity-0'}"
        />
        <h1
          class="block overflow-hidden whitespace-nowrap w-full text-ellipsis font-display font-bold text-lg"
        >
          {post.title}
        </h1>
        <div
          class="flex flex-row flex-wrap items-center justify-start w-full mt-2"
        >
          <h3 class="inline-block w-fit font-sans text-base">
            {getAbsDate(post.date)}
          </h3>
          <BulletPoint />
          <h3 class="inline-block w-fit font-sans text-base">
            {`${Math.floor(readingTime / 60)} min read`}
          </h3>
        </div>
        {#if post.desc}
          <p
            class="block overflow-hidden whitespace-nowrap w-full pr-6 text-ellipsis font-sans text-base mt-2 line-clamp-1"
          >
            {post.desc}
          </p>
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
