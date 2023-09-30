<script lang="ts">
  import DocumentRoute from '$components/document/route.svelte';

  export let data;
</script>

<DocumentRoute
  data={data.project}
  headings={data.project?.headings}
  routeFetch={data.routeFetch}
/>
