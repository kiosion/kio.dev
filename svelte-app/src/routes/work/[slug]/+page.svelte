<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import { project } from '$stores/work';
  import { navOptions, pageHeading } from '$stores/navigation';
  import ProjectContent from '@/components/work/project-content.svelte';
  import { onMount } from 'svelte';

  const pageTitle = $project?.data?.title
    ? `Work | ${$project.data.title.slice(0, 50)}`
    : 'Work';

  onMount(() => {
    pageHeading.set(pageTitle);
    navOptions.set({ down: '', up: '/blog' });
  });
</script>

<svelte:head>
  <title>
    kio.dev | work {$project?.data?.title ? `| ${$project.data.title}` : ''}
  </title>
</svelte:head>

<div data-test-route="work-item">
  {#if $project?.data}
    <ContentWrapper>
      <ProjectContent project={$project.data} />
    </ContentWrapper>
  {/if}
</div>
