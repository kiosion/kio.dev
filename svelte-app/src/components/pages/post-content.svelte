<script lang="ts">
  import EmptyContent from '$components/empty-content.svelte';
  import ErrorBoundary from '$components/error-boundary.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { formatDate } from '$lib/date';
  import type { RouteFetch } from '$types';
  import type { GetPostQueryResult } from '$types/generated/sanity.types';

  let {
    post,
    fetch,
    class: className = undefined,
  }: {
    post: NonNullable<GetPostQueryResult>;
    fetch: RouteFetch;
    class?: string;
  } = $props();
</script>

{#snippet tagItem(tag: NonNullable<NonNullable<GetPostQueryResult>['tags']>[number])}
  <a
    href={`/thoughts/+/${tag.slug?.current}`}
    class="group flex flex-row items-center justify-start gap-x-0.5"
    data-sveltekit-preload-code="eager"
    data-sveltekit-preload-data="hover"
    aria-label={'Topic' + ': ' + tag.title}
  >
    <span class="opacity-70 select-none">#</span>
    <span
      class="group-hover:decoration-orange-light group-hover:dark:decoration-orange-dark underline decoration-transparent decoration-2 underline-offset-[3px] opacity-70 transition-[color,text-decoration-color,opacity] group-hover:opacity-100"
      >{tag.title?.toLowerCase()}</span
    >
  </a>
{/snippet}

<div class="flex h-full w-full flex-col gap-y-5{className ? ' ' + className : ''}">
  <section
    class="mt-8 flex w-full flex-col gap-y-6 border-b border-neutral-300 pb-4 dark:border-neutral-400"
  >
    <div class="flex flex-col gap-y-4">
      <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
        {post.title}
      </h1>
      <div class="flex flex-row items-center gap-2 text-base">
        <Tooltip content={$formatDate(post.date, 'rel') || 'Unknown date'}>
          <p class="cursor-default" aria-label="Published date">
            {$formatDate(post.date, 'full') || 'Unknown date'}
          </p>
        </Tooltip>
        <p class="text-base">&middot;</p>
        <Tooltip content={`${(post.estimatedWordCount ?? 0).toLocaleString('en')} words`}>
          <p class="cursor-default">
            {`${post.estimatedReadingTime || 0} min read`}
          </p>
        </Tooltip>
        {#if post?.tags?.length}
          <p class="text-base">&middot;</p>
          <div class="flex flex-row flex-wrap items-center justify-start gap-2">
            {#each post.tags as tag}
              {@render tagItem(tag)}
            {/each}
          </div>
        {/if}
      </div>
    </div>
    {#if post.desc}
      <p class="text-md max-w-prose tracking-wide opacity-70">
        {post.desc}
      </p>
    {/if}
  </section>

  <section class="font-sans text-base">
    {#if post?.body}
      <ErrorBoundary>
        <PortableText text={post.body} routeFetch={fetch} documentView />
      </ErrorBoundary>
    {:else}
      <EmptyContent />
    {/if}
  </section>
</div>
