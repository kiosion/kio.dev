<script lang="ts">
  import Header from '$components/blog/post-header.svelte';
  import Footer from '$components/blog/post-footer.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import { onMount } from 'svelte';
  import { parseEmoji } from '$helpers/emoji';
  import type { PostDocument } from '$lib/types';

  export let showingSidebar: boolean;

  let body: HTMLElement;

  onMount(async () => {
    parseEmoji(body);
  });

  export let post: PostDocument;
</script>

<Header {post} />
<div class="mt-4 font-sans text-base" bind:this={body}>
  {#if post.body}
    <PortableText text={post.body} />
  {:else}
    <IconHeader
      icon={'Downasaur'}
      text="Hm, it seems empty around here..."
      classes="my-8"
    />
  {/if}
</div>
<Footer {post} />
