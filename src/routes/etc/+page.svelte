<script lang="ts">
  import PageSection from '$components/page-section.svelte';
  import PageTitle from '$components/page-title.svelte';

  let { data } = $props();
  let EtcContent = $derived(data.content.Component);
</script>

<PageSection>
  <PageTitle>
    {data.content.title}
  </PageTitle>
  <EtcContent />
</PageSection>
