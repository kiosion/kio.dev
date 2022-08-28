<script lang="ts">
  import PortableText from '@/components/portable-text/portable-text.svelte';
  import { onMount } from 'svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  import { project } from '@/stores/work';
  import { parseEmoji } from '$lib/helpers/emoji';
  import { navOptions, pageHeading } from '@/stores/menu';
  import PostFooter from '@/components/blog/post-footer.svelte';
  import PostHeader from '@/components/blog/post-header.svelte';
  import IconHeader from '@/components/icon-header.svelte';
  import Downasaur from 'pixelarticons/svg/downasaur.svg';

  let body: HTMLElement;

  navOptions.set({ down: '', up: '/work' });

  const pageTitle = $project?.data?.title
    ? `Project | ${$project.data.title.slice(0, 50)}`
    : 'Project';
  pageHeading.set(pageTitle);

  onMount(() => {
    parseEmoji(body);
  });
</script>

<svelte:head>
  <title
    >kio.dev | project {$project?.data?.title
      ? `| ${$project.data.title}`
      : ''}</title
  >
</svelte:head>

<div data-test-route="project">
  {#if $project?.data}
    <ContentWrapper>
      <PostHeader post={$project.data} />
      <div class="mt-4 font-sans text-base" bind:this={body}>
        {#if $project.data.body}
          <PortableText text={$project.data.body} />
        {:else}
          <IconHeader
            icon={Downasaur}
            text="Hm, it seems empty around here..."
            classes="my-8"
          />
        {/if}
      </div>
      <PostFooter tags={$project.data.tags} />
    </ContentWrapper>
  {/if}
</div>
