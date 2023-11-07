<script lang="ts">
  import { pageTitle } from '$helpers/navigation';
  import { linkTo, t } from '$i18n';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import Icon from '$components/icon.svelte';
  import ListItem from '$components/lists/list-item.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  export let data;

  $: description = $t('A bit about me and what I do');
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

<HeadedBlock heading={$t('About me')}>
  <PortableText text={data.about.bio} />
</HeadedBlock>

<Divider />

<HeadedBlock heading={$t('Recent thoughts')}>
  {#if data.posts.length}
    <div role="group" aria-label={$t('Posts')}>
      {#each data.posts as post}
        <ListItem document={post} small />
      {/each}
    </div>
    <ArrowButton class="w-full" href={$linkTo('/blog')} preload>
      <span class="flex items-center justify-start gap-2">
        <p>{$t('See more')}</p>
        <Icon icon="ArrowRight" width={18} inline />
      </span>
    </ArrowButton>
  {:else}
    <div>
      <p>{$t('No content')}</p>
    </div>
  {/if}
</HeadedBlock>

<style lang="scss">
  div {
    @apply mb-6 mt-5 flex flex-col gap-y-5;

    > p {
      @apply p-4 font-code;
    }
  }
</style>
