<script lang="ts">
  import DocumentRoute from '$components/document/route.svelte';

  export let data;
</script>

<DocumentRoute data={data.project} images={data.images} routeFetch={data.routeFetch} />
