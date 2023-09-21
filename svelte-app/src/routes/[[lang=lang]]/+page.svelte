<script lang="ts">
  import { page } from '$app/stores';
  import { linkTo, t } from '$i18n';

  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import ContentWrapper from '$components/layouts/content-wrapper.svelte';
  import ListItem from '$components/lists/list-item.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  export let data;

  $: pageTitle = `kio.dev | ${$t('Home')}`;
  $: description = $t('A bit about me, my work, and what I do');
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content="about, index, homepage, home, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="twitter:url" content={$page.url.href} />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={description} />
</svelte:head>

<ContentWrapper>
  {#if data.about}
    <HeadedBlock icon="User" heading={$t('About me')}>
      <PortableText text={data.about.bio} />
    </HeadedBlock>

    <div class="align-center flex flex-col justify-start gap-4">
      <HeadedBlock icon="list" heading={$t('Recent posts')} class="flex-[1]">
        {#if data.posts?.length}
          <div
            class="flex w-full flex-col gap-y-5 pt-4"
            role="group"
            aria-label={$t('Posts')}
          >
            {#each data.posts as post}
              <ListItem document={post} small />
            {/each}
            <div class="flex w-full flex-row items-start justify-start gap-2">
              <span class="block w-[72px] flex-shrink-0" />
              <a
                href={$linkTo('/blog')}
                class="inline-block w-full font-code text-accent-light hover:text-dark dark:text-accent-dark dark:hover:text-light"
              >
                {$t('See more')} &rarr;
              </a>
            </div>
          </div>
        {:else}
          <div class="flex flex-col gap-y-5 pt-4">
            <p class="p-4 font-code">
              {$t('No content')}
            </p>
          </div>
        {/if}
      </HeadedBlock>
      <HeadedBlock icon="list" heading={$t('Recent projects')} class="flex-[1]">
        {#if data.projects?.length}
          <div
            class="flex flex-col gap-y-5 pt-4"
            role="group"
            aria-label={$t('Projects')}
          >
            {#each data.projects as project}
              <ListItem document={project} small />
            {/each}
            <div class="flex w-full flex-row items-start justify-start gap-2">
              <span class="block w-[72px] flex-shrink-0" />
              <a
                href={$linkTo('/work')}
                class="inline-block w-full font-code text-accent-light hover:text-dark dark:text-accent-dark dark:hover:text-light"
              >
                {$t('See more')} &rarr;
              </a>
            </div>
          </div>
        {:else}
          <div class="flex flex-col gap-y-5 pt-4">
            <p class="p-4 font-code">
              {$t('No content')}
            </p>
          </div>
        {/if}
      </HeadedBlock>
    </div>
  {:else}
    <EmptyContent />
  {/if}
</ContentWrapper>
