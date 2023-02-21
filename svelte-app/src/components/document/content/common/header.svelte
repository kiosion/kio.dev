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
  import { getReadingTime, formatDate } from '$lib/helpers/date';
  import { getTotalWords } from '$lib/helpers/pt';
  import { t, linkTo } from '$i18n';
  import type { PostDocument, ProjectDocument, PTBlock } from '$types';
  import Tags from '$components/tags.svelte';
  import { fionaPlaceholder } from '$helpers/placeholders';
  import Tooltip from '$components/tooltip.svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS } from '$lib/consts';

  export let model: 'post' | 'project';
  export let data: PostDocument | ProjectDocument;

  let dateFormat = model === 'project' ? 'med' : 'rel',
    readingTime = getReadingTime(
      getTotalWords((data?.body ?? []) as PTBlock[])
    );

  const switchDate = () => {
    if (model === 'project') {
      dateFormat = dateFormat === 'med' ? 'full' : 'med';
      date = formatDate(data.date, dateFormat);
    } else {
      dateFormat = dateFormat === 'rel' ? 'full' : 'rel';
      date = formatDate(data.date, dateFormat);
    }
  };

  $: date =
    model === 'project'
      ? formatDate(data.date, 'med')
      : formatDate(data.date, 'rel');
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
        <Breakpoints queries={DEFAULT_BREAKPOINTS}>
          <svelte:fragment slot="lg">
            <div
              class="relative z-[0] -mb-20 w-[112%] -translate-x-[5.4%] overflow-hidden rounded-t-2xl md:mt-2 lg:-mb-28 xl:-mb-36"
            >
              <span class="gradient" />
              <div
                class="aspect-[10/4] w-full rounded-t-2xl border border-b-0 border-stone-400 bg-cover bg-center dark:border-stone-500/60"
                style={`background-image: url("${imageSrc}");`}
              />
            </div>
          </svelte:fragment>
        </Breakpoints>
      </svelte:fragment>
      <svelte:fragment slot="title">
        <h1
          class="mb-4 h-fit w-fit font-display text-7xl font-bold leading-none"
        >
          {data.title}
        </h1>
      </svelte:fragment>
      <svelte:fragment slot="tags">
        {#if data.tags && data.tags.length > 0}
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
        <div class="mt-6 flex flex-row items-center justify-start">
          {#if data.author?.name}
            <Hoverable>
              <Tooltip text={t('View author')}>
                <button
                  class="focusOutline flex flex-row items-center gap-2 rounded-sm font-mono text-base"
                  on:click={() => goto(linkTo('/about'))}
                  tabindex="0"
                >
                  <div class="aspect-square h-8">
                    {#if pfpRef && pfpCrop}
                      <img
                        class="aspect-square h-full select-none rounded-full border border-stone-500 dark:border-stone-500/60"
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
              </Tooltip>
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
              class="focusOutline inline cursor-pointer rounded-sm font-mono text-base"
              on:click={() => switchDate()}
              tabindex="0"
            >
              {date ? date : t('Unknown date')}
            </button>
          </Hoverable>
          <BulletPoint />
          <p class="cursor-default font-mono text-base">
            {t('{length} min read', { length: Math.floor(readingTime / 60) })}
          </p>
        </div>
      </svelte:fragment>
    </svelte:component>
  </div>
  <Divider />
</div>

<style lang="scss">
  .gradient {
    @apply absolute h-full w-full from-stone-100 transition-colors;

    background: linear-gradient(
      to top,
      var(--tw-gradient-from) 10%,
      var(--tw-gradient-to) 115%
    );
    width: calc(100% + 4px);
    left: -2px;
    right: -2px;
  }

  :global(.dark) {
    .gradient {
      @apply from-stone-900;
    }
  }
</style>
