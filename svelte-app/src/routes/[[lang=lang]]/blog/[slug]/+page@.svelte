<script lang="ts">
  import DocumentRoute from '$components/document/route.svelte';

  export let data;

  $: ({ post, routeFetch } = data);
</script>

<DocumentRoute model="post" data={post} headings={data.post?.headings} {routeFetch} />
