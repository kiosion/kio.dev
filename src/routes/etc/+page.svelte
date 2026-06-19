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
  <div class="prose-links">
    <EtcContent />
  </div>
</PageSection>

<style>
  @reference '../../tailwind.css';

  div {
    :global(hr) {
      @apply my-8 border-t border-dashed border-neutral-200 dark:border-neutral-400;
    }
  }
</style>
