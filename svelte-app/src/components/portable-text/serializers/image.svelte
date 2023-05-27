<script lang="ts">
  import { getCrop, type ImageCrop, urlFor } from '$lib/helpers/image';

  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { ArbitraryTypedObject } from '@portabletext/types';
  import type { SanityImageObject } from '$types';

  export let portableText: Omit<CustomBlockComponentProps, 'value'> & {
    value: ArbitraryTypedObject & {
      asset: SanityImageObject['asset'];
    };
  };

  let imageCrop: ImageCrop;

  $: ({ value } = portableText);
  $: ({ _key } = value);
  $: ({ _ref } = value.asset);
  $: (imageCrop = getCrop(value as unknown as SanityImageObject)), value;
</script>

<div class="h-fit w-full">
  <img
    src={urlFor(_ref)
      .width(800)
      .rect(imageCrop.left, imageCrop.top, imageCrop.width, imageCrop.height)
      .fit('crop')
      .auto('format')
      .url()}
    class="select-none rounded-sm"
    alt={_key}
    draggable="false"
  />
</div>
