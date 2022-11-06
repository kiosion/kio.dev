<script lang="ts">
  import DocumentWrapper from '$components/document/route/wrapper.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import ScrollTo from '$helpers/scrollTo';
  import type { PageData } from './$types';

  let pageTitle = 'Work';
  let allTags: string | undefined;

  onMount(() => {
    navOptions.set({ down: '', up: '/work' });
    ScrollTo($page);
  });

  export let data: PageData;

  $: project?.data
    ? (pageTitle = `Work | ${project.data?.title?.slice?.(0, 50)}`)
    : (pageTitle = 'Work');
  $: pageTitle && pageHeading.set(pageTitle);
  $: project?.data?.tags?.length &&
    (allTags = project.data.tags.reduce(
      (acc, tag, i) =>
        i > 0
          ? `${acc}, ${tag.title.toLowerCase()}`
          : `${tag.title.toLowerCase()}`,
      ''
    ));
  $: ({ project } = data);
  $: $page && ScrollTo($page);
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

<DocumentWrapper model="project" data={project?.data} />
