<script lang="ts">
  import { onMount } from 'svelte';

  import { getCrop, urlFor } from '$lib/helpers/image';

  import Spinner from '$components/loading/spinner.svelte';

  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { ArbitraryTypedObject } from '@portabletext/types';
  import type { RouteFetch, SanityImageObject } from '$types';

  export let portableText: Omit<CustomBlockComponentProps, 'value'> & {
    value: ArbitraryTypedObject & {
      asset: SanityImageObject['asset'];
    };
  };

  const { value } = portableText,
    { _key } = value,
    { _ref } = value.asset,
    routeFetch = portableText.global.context.routeFetch as RouteFetch,
    imageCrop = getCrop(value),
    baseUrl = urlFor(_ref),
    placeholder = baseUrl
      .width(30)
      .rect(imageCrop.left, imageCrop.top, imageCrop.width, imageCrop.height)
      .fit('crop')
      .auto('format')
      .blur(40)
      .url(),
    style = `
      max-width: ${imageCrop.width}px;
      max-height: ${imageCrop.height}px;
      aspect-ratio: ${imageCrop.width} / ${imageCrop.height};
    `;

  let srcPromise: Promise<string> = new Promise((_res) => {});

  onMount(() => {
    srcPromise = routeFetch(
      baseUrl
        .width(800)
        .rect(imageCrop.left, imageCrop.top, imageCrop.width, imageCrop.height)
        .fit('crop')
        .auto('format')
        .url()
    ).then((res) => {
      const mimeType =
        res.headers.get('content-type') ||
        res.headers.get('Content-Type') ||
        'image/jpeg';
      return res
        .arrayBuffer()
        .then(
          (buf) =>
            `data:${mimeType};base64,${btoa(
              new Uint8Array(buf).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )}`
        );
    });
  });
</script>

<div>
  {#await srcPromise}
    <div class="loading"><Spinner /></div>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={placeholder} draggable="false" {style} />
  {:then src}
    <img {src} alt={_key} draggable="false" {style} />
  {:catch e}
    <p class="error">Error: {e?.message || e}</p>
    <img src={placeholder} alt={_key} draggable="false" {style} />
  {/await}
</div>

<style lang="scss">
  div:not(.loading) {
    @apply relative h-fit w-full;
  }

  img {
    @apply mx-auto h-fit w-full select-none rounded-sm;
  }

  .error,
  .loading {
    @apply absolute left-1/2 top-1/2 h-fit w-fit max-w-full -translate-x-1/2 -translate-y-1/2 transform text-center font-code text-base;
  }
</style>
