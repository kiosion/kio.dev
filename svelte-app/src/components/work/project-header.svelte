<script lang="ts">
  import { goto } from '$app/navigation';
  import { urlFor, getCrop } from '$lib/helpers/image';
  import { getAbsDate, getShortDate } from '$lib/helpers/date';
  import type { ProjectDocument } from '$lib/types';
  import BulletPoint from '$components/bullet-point.svelte';
  import Divider from '$components/divider.svelte';

  export let project: ProjectDocument;

  let date = getShortDate(project.date);
  let dateFormat = 'short';

  const switchDate = () => {
    dateFormat === 'short'
      ? (date = getAbsDate(project.date))
      : (date = getShortDate(project.date));
    dateFormat = dateFormat === 'short' ? 'abs' : 'short';
  };

  $: pfpRef = project.author?.image?.asset?._ref;
  $: pfpCrop = pfpRef && getCrop(project.author?.image);
  $: headerRef = project.image?.asset?._ref;
  $: headerCrop = headerRef && getCrop(project.image);
</script>

<div class="mb-4" data-test-id="post-header">
  <div class="flex flex-col">
    {#if headerRef && headerCrop}
      <div class="mb-8 md:mt-2">
        <img
          src={urlFor(headerRef)
            .width(1000)
            .height(400)
            .rect(
              headerCrop.left,
              headerCrop.top,
              headerCrop.width,
              headerCrop.height
            )
            .fit('crop')
            .format('webp')
            .url()}
          alt="Project preview"
          class="w-full shadow-[0_0_28px_-2px_var(--tw-shadow)] shadow-slate-500/50 dark:shadow-slate-500/20 rounded-tl-2xl rounded-tr-sm rounded-bl-sm rounded-br-2xl aspect-[1000/400] select-none"
          draggable="false"
        />
      </div>
    {/if}
    <h1 class="w-fit h-fit font-display text-6xl leading-tight mb-4 font-bold">
      {project.title}
    </h1>
    {#if project.tags}
      <div class="flex flex-row justify-start items-center gap-2">
        {#each project.tags as tag}
          <a href="/work/{tag.slug.current}" class="categoryTag">
            {tag.title}
          </a>
        {/each}
      </div>
    {/if}
    {#if project.desc}
      <div class="mt-4">
        <p class="font-mono text-base">{project.desc}</p>
      </div>
    {/if}
    <div class="flex flex-row items-center justify-start mt-6">
      <button
        class="flex flex-row gap-2 items-center font-mono text-base"
        on:click={() => goto('/about')}
        tabindex="0"
      >
        <div class="h-8 aspect-square">
          {#if pfpRef && pfpCrop}
            <img
              class="rounded-full aspect-square h-full"
              src={urlFor(pfpRef)
                .size(50, 50)
                .rect(pfpCrop.left, pfpCrop.top, pfpCrop.width, pfpCrop.height)
                .fit('crop')
                .format('webp')
                .url()}
              alt="Profile pic"
              draggable="false"
            />
          {/if}
        </div>
        <p class="w-fit whitespace-nowrap">
          By {project.author?.name ? project.author.name : 'Unknown'}
        </p>
      </button>
      <BulletPoint />
      <button
        class="inline font-mono text-base cursor-pointer select-none"
        on:click={() => switchDate()}
        tabindex="0"
      >
        {date ? date : '...'}
      </button>
    </div>
  </div>
  <Divider />
</div>
