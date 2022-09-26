<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import ProjectContent from '@/components/work/project-content.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { page } from '$app/stores';

  let pageTitle = 'Work';
  let allTags: string | undefined;

  onMount(() => {
    navOptions.set({ down: '', up: '/blog' });
  });

  export let data: PageData;

  $: project?.data
    ? (pageTitle = `Work | ${project.data?.title?.slice?.(0, 50)}`)
    : (pageTitle = 'Work');
  $: pageTitle && pageHeading.set(pageTitle);
  $: project?.data?.tags?.length &&
    (allTags = project.data.tags.reduce(
      (acc, tag, i) =>
        (i > 0
          ? `${acc}, ${tag.title.toLowerCase()}`
          : `${tag.title.toLowerCase()}`),
      ''
    ));
  $: ({ project } = data);
</script>

<svelte:head>
  <title>
    kio.dev | {pageTitle.toLowerCase()}
  </title>
  <meta
    name="description"
    content={project?.data?.desc ? project.data.desc : ''}
  />
  <meta
    name="keywords"
    content="{allTags
      ? `${allTags}, `
      : ''}blog, project, kio.dev, kio, kiosion"
  />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content="kio.dev | {pageTitle.toLowerCase()}" />
  <meta
    property="og:description"
    content={project?.data?.desc ? project.data.desc : ''}
  />
  <meta property="twitter:url" content={$page.url.href} />
  <meta
    property="twitter:title"
    content="kio.dev | {pageTitle.toLowerCase()}"
  />
  <meta
    property="twitter:description"
    content={project?.data?.desc ? project.data.desc : ''}
  />
</svelte:head>

<div data-test-route="work-item">
  {#if project?.data}
    <ContentWrapper>
      <ProjectContent project={project.data} />
    </ContentWrapper>
  {/if}
</div>
