<script lang="ts">
  import { linkTo, t } from '$lib/i18n';
  import { pageTitle } from '$lib/navigation';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import ListItem from '$components/lists/list-item.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  export let data;

  $: description = $t('pages.about.description');
</script>

<svelte:head>
  <title>{$pageTitle}</title>
  <meta itemprop="name" content={$pageTitle} />
  <meta itemprop="description" content={description} />
  <meta name="robots" content="index, follow" />
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={$pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:title" content={$pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

<div class="flex flex-col gap-y-5">
  <BaseContainer>
    {#if data.config?.about}
      {#each data.config.about as aboutSection, idx}
        {#if aboutSection.content}
          <HeadedBlock heading={aboutSection.title} first={idx === 0}>
            <PortableText text={aboutSection.content} class="-mt-2" bodySize="base"
            ></PortableText>
          </HeadedBlock>

          {#if idx < data.config.about.length - 1}
            <span
              class="-my-1 block w-full min-w-0 flex-1 border-b border-dashed border-neutral-200 transition-colors dark:border-neutral-400"
            ></span>
          {/if}
        {/if}
      {/each}
    {:else}
      <EmptyContent />
    {/if}
  </BaseContainer>

  <BaseContainer>
    <HeadedBlock heading={$t('Recent thoughts')} let:id constrainWidth={false} first>
      {#if data.posts.length}
        <div
          class="flex flex-row flex-wrap gap-5 px-5 pb-1"
          role="group"
          aria-labelledby="{id}-heading"
        >
          {#each data.posts as post}
            <ListItem document={post} />
          {/each}
        </div>
      {:else}
        <div class="px-8">
          <p class="font-code p-4">{$t('No content')}</p>
        </div>
      {/if}
    </HeadedBlock>
  </BaseContainer>

  <BaseContainer class="flex flex-row gap-3 p-2 text-sm">
    <ArrowButton
      href={$linkTo('/thoughts')}
      dir="right"
      placement="after"
      text={$t('All posts')}
      preload-code
    />
    <ArrowButton
      href={$linkTo('/thoughts/+')}
      dir="right"
      placement="after"
      text={$t('Topics')}
      preload-code
      preload-data
    />
  </BaseContainer>
</div>
