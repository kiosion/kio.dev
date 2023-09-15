<script lang="ts">
  import { formatDate, getReadingTime } from '$helpers/date';
  import { getTotalWords } from '$helpers/pt';
  import { currentLang, t } from '$i18n';

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
      date = formatDate(data.date, dateFormat, $currentLang);
    } else {
      dateFormat = dateFormat === 'rel' ? 'full' : 'rel';
      date = formatDate(data.date, dateFormat, $currentLang);
    }
  };

  $: date =
    model === 'project'
      ? formatDate(data.date, 'med', $currentLang)
      : formatDate(data.date, 'rel', $currentLang);
</script>

<div class="mb-4" data-test-id="{model}-header">
  <div class="flex flex-col">
    <svelte:component this={model === 'post' ? PostHeader : ProjectHeader}>
      <svelte:fragment slot="title">
        <h1
          class="my-4 h-fit w-fit font-display text-4xl font-bold text-black dark:text-white lg:mt-10 lg:text-6xl lg:font-black"
        >
          {data.title}
        </h1>
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
