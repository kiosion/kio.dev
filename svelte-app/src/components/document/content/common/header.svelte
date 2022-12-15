<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck Need to fix typing for {data}
  import Divider from '$components/divider.svelte';
  import BulletPoint from '$components/bullet-point.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import PostHeader from '$components/document/content/post/header.svelte';
  import ProjectHeader from '$components/document/content/project/header.svelte';
  import { goto } from '$app/navigation';
  import { getCrop, urlFor } from '$lib/helpers/image';
  import {
    getAbsDate,
    getShortDate,
    getRelDate,
    getReadingTime
  } from '$lib/helpers/date';
  import { getTotalWords } from '$lib/helpers/pt';
  import { t } from '$i18n';
  import type { PostDocument, ProjectDocument, PTBlock } from '$types';
  import Tags from '$components/tags.svelte';
  import { fionaPlaceholder } from '$helpers/placeholders';

  export let model: 'post' | 'project';
  export let data: PostDocument | ProjectDocument;

  let date =
    model === 'project' ? getShortDate(data.date) : getRelDate(data.date);
  let dateFormat = model === 'project' ? 'short' : 'rel';
  let readingTime = getReadingTime(
    getTotalWords((data?.body ?? []) as PTBlock[])
  );

  const switchDate = () => {
    if (model === 'project') {
      dateFormat === 'short'
        ? (date = getAbsDate(data.date))
        : (date = getShortDate(data.date));
      dateFormat = dateFormat === 'short' ? 'abs' : 'short';
    } else {
      dateFormat === 'rel'
        ? (date = getAbsDate(data.date) ?? 'Unknown date')
        : (date = getRelDate(data.date));
      dateFormat = dateFormat === 'rel' ? 'abs' : 'rel';
    }
  };

  $: pfpRef = data.author?.image?.asset?._ref;
  $: pfpCrop = pfpRef && getCrop(data.author?.image);
  $: external = model === 'project' && (data as ProjectDocument).external;
  $: authorName = external
    ? (data as ProjectDocument).externalAuthor ?? 'Unknown'
    : data.author?.name ?? 'Unknown';
  $: slug = data.slug.current;
  $: imageSrc = fionaPlaceholder(slug);
</script>

<div class="mb-4" data-test-id="{model}-header">
  <div class="flex flex-col">
    <svelte:component
      this={model === 'post' ? PostHeader : ProjectHeader}
      {data}
    >
      <svelte:fragment slot="image">
        <div
          class="relative rounded-t-2xl overflow-hidden md:mt-2 -mb-20 lg:-mb-28 xl:-mb-36 z-[0] w-[112%] -translate-x-[5.4%]"
        >
          <div
            class="absolute w-full h-full gradient from-slate-100 dark:from-slate-800 transition-colors"
          >
            &nbsp;
          </div>
          <div
            class="w-full aspect-[10/4] bg-cover bg-center"
            style={`background-image: url("${imageSrc}");`}
          />
        </div>
      </svelte:fragment>
      <svelte:fragment slot="title">
        <h1
          class="w-fit h-fit font-display text-6xl leading-tight font-bold mb-4"
        >
          {data.title}
        </h1>
      </svelte:fragment>
      <svelte:fragment slot="tags">
        {#if data.tags}
          <Tags {model} data={data.tags} size="lg" />
        {/if}
      </svelte:fragment>
      <svelte:fragment slot="desc">
        {#if data.desc}
          <div class="mt-4">
            <p class="font-mono text-base">{data.desc}</p>
          </div>
        {/if}
      </svelte:fragment>
      <svelte:fragment slot="meta">
        <div class="flex flex-row items-center justify-start mt-6">
          {#if data.author?.name}
            <Hoverable>
              <button
                class="flex flex-row gap-2 items-center font-mono text-base rounded-sm focusOutline"
                on:click={() => goto('/about')}
                tabindex="0"
              >
                <div class="h-8 aspect-square">
                  {#if pfpRef && pfpCrop}
                    <img
                      class="rounded-full aspect-square h-full select-none"
                      src={urlFor(pfpRef)
                        .size(50, 50)
                        .rect(
                          pfpCrop.left,
                          pfpCrop.top,
                          pfpCrop.width,
                          pfpCrop.height
                        )
                        .fit('crop')
                        .format('webp')
                        .url()}
                      alt="Profile pic"
                      draggable="false"
                    />
                  {/if}
                </div>
                <p class="w-fit whitespace-nowrap">
                  {t('By {author}', {
                    author: authorName
                  })}
                </p>
              </button>
            </Hoverable>
            <BulletPoint />
          {:else if external}
            <div class="items-center font-mono text-base">
              <p class="w-fit whitespace-nowrap">
                {t('By {author}', {
                  author: authorName
                })}
              </p>
            </div>
            <BulletPoint />
          {/if}
          <Hoverable>
            <button
              class="inline font-mono text-base cursor-pointer rounded-sm focusOutline"
              on:click={() => switchDate()}
              tabindex="0"
            >
              {date ? date : '...'}
            </button>
          </Hoverable>
          {#if model === 'post'}
            <BulletPoint />
            <p
              class="font-mono text-base cursor-default"
              role="button"
              aria-label="Reading time"
            >
              {t('{length} min read', { length: Math.floor(readingTime / 60) })}
            </p>
          {/if}
        </div>
      </svelte:fragment>
    </svelte:component>
  </div>
  <Divider />
</div>

<style lang="scss">
  .gradient {
    background: linear-gradient(
      to top,
      var(--tw-gradient-from) 5%,
      var(--tw-gradient-to) 100%
    );
    width: calc(100% + 4px);
    left: -2px;
    right: -2px;
  }
</style>
