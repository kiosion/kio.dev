<script lang="ts">
  import DocumentRoute from '$components/document/route.svelte';

  export let data;

  $: ({ project } = data);
</script>

<DocumentRoute data={project} headings={project?.headings} />
