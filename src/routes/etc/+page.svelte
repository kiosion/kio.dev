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

  /* TODO: generacize/share md styles globally */
  div {
    :global(hr) {
      @apply my-8 border-t border-dashed border-neutral-200 dark:border-neutral-400;
    }

    :global(p > code),
    :global(li > code) {
      @apply mx-0.5 rounded-sm bg-neutral-200/60 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-400/60;
    }

    :global(pre.shiki) {
      @apply my-6 max-w-3xl overflow-x-auto rounded-md p-4 font-mono text-sm leading-5;
    }

    :global(pre.shiki code) {
      @apply font-mono;
    }
  }
</style>
