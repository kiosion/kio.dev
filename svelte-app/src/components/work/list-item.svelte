<script lang="ts">
  import ListItemWrapper from '../list-item-wrapper.svelte';
  import { onMount } from 'svelte';
  import type { ProjectDocument } from '$lib/types';
  import type UIfx from 'uifx';
  import { urlFor, getCrop, type ImageCrop } from '$helpers/image';
  import { goto } from '$app/navigation';
  import BulletPoint from '../bullet-point.svelte';
  import { getShortDate } from '$helpers/date';
  import Hoverable from '$components/hoverable.svelte';
  import Features from '$stores/features';

  export let project: ProjectDocument;

  let click: UIfx;
  let imageCrop: ImageCrop | undefined;
  let _ref: string | undefined;
  let hovered = false;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });

  const onClick = () => {
    $CanUseSounds && click.play();
    goto(`/work/${project.slug.current}`);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      onClick();
    }
  };

  $: _ref = project.image?.asset?._ref;
  $: project.image && (imageCrop = getCrop(project.image));
  $: date = getShortDate(project.date);
  $: CanUseSounds = Features.can('use sounds feature');
</script>

<ListItemWrapper>
  {#if project}
    <div
      class="absolute top-4 left-2 h-[calc(100%_-_26px)] {hovered
        ? 'w-[2px]'
        : 'w-0'} bg-emerald-400 dark:bg-emerald-300 transition-[width]"
      aria-hidden="true"
    >
      &nbsp;
    </div>
    <Hoverable bind:hovered>
      <section
        class="flex flex-row items-stretch justify-stretch gap-4 w-full min-h-[8rem] h-fit p-4 {hovered
          ? 'pl-6 bg-slate-300/50 dark:bg-slate-700/50'
          : 'bg-slate-200/50 dark:bg-slate-900/50'} rounded-2xl transition-[padding,background-color]"
        data-test-id="list-item"
        tabindex="0"
        role="button"
        aria-label="Project - {project.title}"
        on:click={onClick}
        on:keydown={onKey}
      >
        <div
          class="hidden sm:flex basis-auto aspect-[2/1] min-w-min min-h-min rounded-md overflow-hidden"
        >
          {#if _ref && imageCrop}
            <img
              src={urlFor(_ref)
                .height(200)
                .width(400)
                .rect(
                  imageCrop.left,
                  imageCrop.top,
                  imageCrop.width,
                  imageCrop.height
                )
                .fit('crop')
                .format('webp')
                .url()}
              class="aspect-[2/1] object-cover h-full w-full"
              alt="Project cover"
            />
          {/if}
        </div>
        <div class="flex flex-col items-stretch justify-start w-full">
          {#if date || project.tags}
            <div
              class="flex flex-row items-center justify-start pb-2 font-sans text-base text-slate-700 dark:text-slate-200"
            >
              <p class="">{date}</p>
              {#if project.tags}
                <BulletPoint />
                <div
                  class="flex flex-row justify-start items-center gap-2 flex-wrap"
                >
                  {#each project.tags as tag}
                    <a href="/work/+/{tag.slug.current}" class="categoryTag-sm">
                      {tag.title}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
          <h1
            class="overflow-hidden whitespace-nowrap w-full text-ellipsis font-display font-bold text-2xl"
          >
            {project.title}
          </h1>
          {#if project.desc}
            <p
              class="block overflow-hidden w-full pr-6 text-ellipsis font-sans text-base pt-2 line-clamp-2"
            >
              {project.desc}
            </p>
          {/if}
        </div>
      </section>
    </Hoverable>
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
