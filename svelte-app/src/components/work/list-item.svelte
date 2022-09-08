<script lang="ts">
  import ListItemWrapper from '../list-item-wrapper.svelte';
  import { onMount } from 'svelte';
  import { sounds } from '$stores/features';
  import type { ProjectDocument } from '$lib/types';
  import type UIfx from 'uifx';
  import { urlFor, getCrop, type ImageCrop } from '$helpers/image';
  import { goto } from '$app/navigation';
  import BulletPoint from '../bullet-point.svelte';
  import { getShortDate } from '$helpers/date';

  export let project: ProjectDocument;
  export let mousePos = [0, 0];

  let click: UIfx;
  let imageCrop: ImageCrop | undefined;
  let _ref: string | undefined;
  let hovered = false;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });

  $: _ref = project.image?.asset?._ref;
  $: project.image && (imageCrop = getCrop(project.image));
  $: date = getShortDate(project.date);
</script>

<ListItemWrapper {hovered} {mousePos} wrapperClass="mt-6">
  {#if project}
    <div
      class="rounded-xl"
      tabindex="0"
      role="button"
      aria-label="Project - {project.title}"
      on:mouseenter={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
      on:click={() => {
        $sounds === 'on' && click?.play();
        goto(`/work/${project.slug.current}`);
      }}
    >
      <section
        class="flex flex-row items-stretch justify-stretch gap-4 w-full min-h-[8rem] h-fit max-h-60 p-4 roundedCard-lg"
        data-test-id="list-item"
        on:focus={() => (hovered = true)}
        on:blur={() => (hovered = false)}
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
          <h1
            class="overflow-hidden whitespace-nowrap w-full text-ellipsis font-display font-bold text-xl"
          >
            {project.title}
          </h1>
          {#if date || project.tags}
            <div
              class="flex flex-row items-center justify-start mt-1 font-sans text-base text-slate-700 dark:text-slate-200"
            >
              <p class="">{date}</p>
              {#if project.tags}
                <BulletPoint />
                <div
                  class="flex flex-row justify-start items-center gap-2 flex-wrap"
                >
                  {#each project.tags as tag}
                    <a href="/work/t/{tag.slug.current}" class="categoryTag-sm">
                      {tag.title}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
          {#if project.desc}
            <p
              class="block overflow-hidden w-full pr-6 text-ellipsis font-sans text-base mt-2 line-clamp-2"
            >
              {project.desc}
            </p>
          {/if}
        </div>
      </section>
    </div>
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
