<script lang="ts">
  import AboutContent from '$components/pages/about-content.svelte';

  const { data } = $props();
</script>

<AboutContent config={data.config} wakatimeStats={data.wakatimeStats} />
