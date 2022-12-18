<script lang="ts">
  import DocumentRoute from '$components/document/route.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: ({ project, headings, comments } = data);
</script>

<DocumentRoute model="project" data={project?.data} {headings} {comments} />
