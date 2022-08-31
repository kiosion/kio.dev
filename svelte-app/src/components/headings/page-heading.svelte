<script lang="ts">
  import IconHeader from '$components/icon-header.svelte';
  import type { PixelIcon } from '@/lib/types';

  export let heading: string;
  export let text = '';
  export let icon = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/art-text.svg').then((Icon) => Icon.default);
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
