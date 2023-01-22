<script lang="ts">
  import IconHeader from '$components/headings/icon-header.svelte';

  export let title: string | undefined = undefined;
  export let icon: string | undefined = undefined;
</script>

{#if title && icon}
  <IconHeader {icon} text={title} />
{/if}
<div>
  <slot />
</div>
