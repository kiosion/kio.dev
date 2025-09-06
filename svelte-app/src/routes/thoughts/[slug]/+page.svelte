<script lang="ts">
  import DocumentRoute from '$components/document/route.svelte';

  const { data } = $props();
</script>

<DocumentRoute data={data.post} routeFetch={data.routeFetch} />
