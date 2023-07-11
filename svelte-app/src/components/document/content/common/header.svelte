<script lang="ts">
  import Breakpoints from 'svelte-breakpoints';

  import { formatDate, getReadingTime } from '$helpers/date';
  import { fionaPlaceholder } from '$helpers/placeholders';
  import { getTotalWords } from '$helpers/pt';
  import { t } from '$i18n';
  import { DEFAULT_BREAKPOINTS } from '$lib/consts';

  import BulletPoint from '$components/bullet-point.svelte';
  import Divider from '$components/divider.svelte';
  import PostHeader from '$components/document/content/post/header.svelte';
  import ProjectHeader from '$components/document/content/project/header.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Tags from '$components/tags.svelte';

  import type { PostDocument, ProjectDocument, PTBlock } from '$types';

  export let model: 'post' | 'project', data: PostDocument | ProjectDocument;

  let dateFormat: 'med' | 'rel' | 'full' = model === 'project' ? 'med' : 'rel',
    readingTime = getReadingTime(getTotalWords((data?.body ?? []) as PTBlock[]));

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
    model === 'project' ? formatDate(data.date, 'med') : formatDate(data.date, 'rel');
  $: slug = data.slug.current;
  $: imageSrc = fionaPlaceholder(slug);
</script>

<div class="mb-4" data-test-id="{model}-header">
  <div class="flex flex-col">
    <svelte:component this={model === 'post' ? PostHeader : ProjectHeader}>
      <svelte:fragment slot="image">
        <Breakpoints queries={DEFAULT_BREAKPOINTS}>
          <svelte:fragment slot="lg">
            <div
              class="relative z-[0] -mb-20 w-[112%] -translate-x-[5.4%] overflow-hidden rounded-t-2xl md:mt-2 lg:-mb-28 xl:-mb-48"
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
        <Breakpoints queries={DEFAULT_BREAKPOINTS}>
          <svelte:fragment slot="lg">
            <h1 class="mb-4 h-fit w-fit font-display text-7xl font-black leading-none">
              {data.title}
            </h1>
          </svelte:fragment>
          <svelte:fragment slot="sm">
            <h1 class="mb-4 h-fit w-fit font-display text-4xl font-bold leading-none">
              {data.title}
            </h1>
          </svelte:fragment>
        </Breakpoints>
      </svelte:fragment>
      <svelte:fragment slot="desc">
        {#if data.desc}
          <div class="mt-4">
            <p class="font-mono text-base">{data.desc}</p>
          </div>
        {/if}
      </svelte:fragment>
      <svelte:fragment slot="meta">
        <div class="flex flex-row flex-wrap items-center justify-start gap-y-2">
          <Hoverable>
            <button
              class="focusOutline inline cursor-pointer rounded-sm font-mono text-base"
              on:click={() => switchDate()}
              tabindex="0"
            >
              {date ? date : $t('Unknown date')}
            </button>
          </Hoverable>
          <BulletPoint />
          <p class="cursor-default font-mono text-base">
            {$t('{length} min read', { length: Math.floor(readingTime / 60) })}
          </p>
          {#if data.tags && data.tags.length > 0}
            <BulletPoint />
            <Tags {model} data={data.tags} size="sm" />
          {/if}
        </div>
      </svelte:fragment>
    </svelte:component>
  </div>
  <Divider />
</div>

<style lang="scss">
  .gradient {
    @apply absolute h-full w-full from-stone-100 transition-colors duration-150;

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
