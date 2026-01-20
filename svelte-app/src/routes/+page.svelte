<script lang="ts">
  import HomeContent from '$components/pages/home-content.svelte';

  let { data } = $props();
</script>

<HomeContent config={data.config} posts={data.posts} />
