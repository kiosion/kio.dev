<script lang="ts">
  import DocumentRoute from '$components/document/route.svelte';

  export let data;
</script>

<DocumentRoute data={data.post} config={data.config} routeFetch={data.routeFetch} />
