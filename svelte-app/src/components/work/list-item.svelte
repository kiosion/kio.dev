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
      e.preventDefault();
      onClick();
    }
  };

  $: _ref = project.image?.asset?._ref;
  $: project.image && (imageCrop = getCrop(project.image));
  $: date = getShortDate(project.date);
  $: CanUseSounds = Features.can('use sounds feature');
</script>

<Hoverable bind:hovered>
  <section
    class="relative flex flex-col items-stretch justify-end gap-y-4 p-4 w-full lg:w-[calc(50%_-_12px)] 3xl:w-[calc(50%_-_12px)] rounded-2xl transition-[padding,background-color] {hovered
      ? 'bg-slate-300/50 dark:bg-slate-700/50'
      : 'bg-slate-200/50 dark:bg-slate-900/50'}"
    data-test-id="list-item"
    tabindex="0"
    role="button"
    aria-label="Project - {project.title}"
    on:click={onClick}
    on:keydown={onKey}
  >
    <!-- Image -->
    <div class="w-full aspect-[4/1] lg:aspect-[2/1] overflow-hidden rounded-md">
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
    <div class="flex flex-col gap-y-3 p-3">
      <!-- Title / date / tags -->
      <div class="w-full flex flex-col items-center justify-start">
        <h1
          class="w-full overflow-hidden whitespace-nowrap text-ellipsis line-clamp-1 font-display font-bold text-2xl decoration-[3px] decoration-emerald-300 {hovered
            ? 'underline'
            : ''}"
        >
          {project.title}
        </h1>
      </div>
      <div class="w-full flex flex-row items-center justify-start">
        <p class="font-sans text-base text-slate-700 dark:text-slate-200">
          {date}
        </p>
        {#if project.tags}
          <BulletPoint />
          <div class="flex flex-row justify-start items-center gap-2 flex-wrap">
            {#each project.tags as tag}
              <a href="/work/+/{tag.slug.current}" class="categoryTag-sm">
                {tag.title}
              </a>
            {/each}
          </div>
        {/if}
      </div>
      <!-- Description -->
      <div class="">
        {#if project.desc}
          <p
            class="block overflow-hidden w-full pr-6 text-ellipsis font-sans text-base pt-2 line-clamp-2"
          >
            {project.desc}
          </p>
        {/if}
      </div>
    </div>
  </section>
</Hoverable>

<!-- <Hoverable bind:hovered>
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
  </section>
</Hoverable> -->
