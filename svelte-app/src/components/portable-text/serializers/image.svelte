<script lang="ts">
  import { urlFor, getCrop, type ImageCrop } from '$lib/helpers/image';
  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { SanityImageObject } from '$types';

  export let portableText: CustomBlockComponentProps & SanityImageObject;

  let imageCrop: ImageCrop;

  $: ({ value } = portableText);
  $: ({ _key } = value);
  $: ({ _ref } = value.asset);
  $: (imageCrop = getCrop(value as unknown as SanityImageObject)), value;
</script>

<div class="w-full h-fit">
  <img
    src={urlFor(_ref)
      .width(800)
      .rect(imageCrop.left, imageCrop.top, imageCrop.width, imageCrop.height)
      .fit('crop')
      .auto('format')
      .url()}
    class="rounded-sm select-none"
    alt={_key}
    draggable="false"
  />
</div>
