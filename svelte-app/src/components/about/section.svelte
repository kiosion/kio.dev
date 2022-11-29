<script lang="ts">
  import Divider from '$components/divider.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';

  export let title: string | undefined = undefined;
  export let icon: string | undefined = undefined;
</script>

<div>
  <Divider />
  {#if title && icon}
    <IconHeader {icon} text={title} />
  {/if}
  <div>
    <slot />
  </div>
</div>
