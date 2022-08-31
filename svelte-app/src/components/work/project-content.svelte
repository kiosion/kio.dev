<script lang="ts">
  import Header from '$components/work/project-header.svelte';
  import Footer from '$components/work/project-footer.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import { onMount } from 'svelte';
  import { parseEmoji } from '$helpers/emoji';
  import type { ProjectDocument } from '$lib/types';

  let body: HTMLElement;

  onMount(async () => {
    parseEmoji(body);
  });

  export let project: ProjectDocument;
</script>

<Header {project} />
<div class="mt-4 font-sans text-base" bind:this={body}>
  {#if project.body}
    <PortableText text={project.body} />
  {:else}
    <IconHeader
      icon="Downasaur"
      text="Hm, it seems empty around here..."
      classes="my-8"
    />
  {/if}
</div>
<Footer {project} />
