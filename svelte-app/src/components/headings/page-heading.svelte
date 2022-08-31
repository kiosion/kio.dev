<script lang="ts">
  import IconHeader from '$components/icon-header.svelte';

  export let heading: string;
  export let text = '';
  export let icon = 'ArtText';
  export let classes = '';
</script>

<div class="mt-14 mb-8">
  <IconHeader
    {icon}
    text={heading}
    classes="w-full h-fit {text !== '' ? 'mb-2' : ''} {classes}"
  />
  {#if text !== ''}
    <p class="font-sans text-base w-full h-fit line-clamp-2">{text}</p>
  {/if}
</div>
