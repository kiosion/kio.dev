<script lang="ts">
  import PageTransition from '$components/page-transition.svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  let appLoaded = true;
</script>

<div>
  {#if appLoaded}
    <PageTransition url={data.url}>
      <slot />
    </PageTransition>
  {/if}
</div>
