<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import { project } from '$stores/work';
  import { navOptions, pageHeading } from '$stores/nav';
  import ProjectContent from '@/components/work/project-content.svelte';

  const pageTitle = $project?.data?.title
    ? `Project | ${$project.data.title.slice(0, 50)}`
    : 'Project';
  pageHeading.set(pageTitle);
  navOptions.set({ down: '', up: '/work' });
</script>

<svelte:head>
  <title>
    kio.dev | project {$project?.data?.title ? `| ${$project.data.title}` : ''}
  </title>
</svelte:head>

<div data-test-route="project">
  {#if $project?.data}
    <ContentWrapper>
      <ProjectContent project={$project.data} />
    </ContentWrapper>
  {/if}
</div>
