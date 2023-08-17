<script lang="ts">
  import DocumentRoute from '$components/document/route.svelte';

  export let data;

  $: ({ project } = data);
</script>

<DocumentRoute model="project" data={project} headings={project?.headings} />
