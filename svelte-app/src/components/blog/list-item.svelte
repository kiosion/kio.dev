<script lang="ts">
  import type { Post } from '@/lib/types';
  import moment from 'moment';

  export let post: Post | null = null;
  export let error: string | null = null;
</script>

<section
  class="flex flex-col align-center justify-center w-full h-32 mt-6 p-4 bg-slate-200 dark:bg-slate-900 rounded duration-150"
  data-test-id="list-item"
>
  {#if error}
    <p class="text-center text-base w-full self-center">{error}</p>
  {:else if post}
    <a href="blog/{post.slug && post.slug.current}">
      <h1
        class="block overflow-hidden whitespace-nowrap w-full text-ellipsis font-display font-bold text-lg"
      >
        {post.title}
      </h1>
      <h3 class="font-sans text-base mt-2">
        {moment(post.date).format('MMM Do, YYYY')}
      </h3>
      {#if post.desc}
        <p
          class="block overflow-hidden whitespace-nowrap w-full pr-6 text-ellipsis font-sans text-base mt-2 line-clamp-1"
        >
          {post.desc}
        </p>
      {/if}
    </a>
  {/if}
</section>
