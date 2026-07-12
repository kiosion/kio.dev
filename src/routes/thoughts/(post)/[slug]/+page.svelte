<script lang="ts">
  import { page } from '$app/state';
  import { prefersReducedMotion } from '$lib/transitions';

  const { data } = $props();
  const PostComponent = $derived(data.post.Component);

  $effect(() => {
    if (page?.url) {
      const { hash } = page.url || { hash: '' };

      if (!hash.length) {
        return;
      }

      const target =
        document.getElementById(hash.slice(1)) ||
        document.getElementById(`heading-${hash.slice(1)}`);

      target?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
        block: 'center',
      });
    }
  });
</script>

<svelte:head>
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="article" />
  <meta
    property="article:published_time"
    content={new Date(data.post.date || '0')?.toISOString()}
  />
</svelte:head>

<PostComponent />
