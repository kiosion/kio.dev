<script lang="ts">
  import { urlFor } from '$lib/helpers/image';
  import type {
    CustomBlockComponentProps,
    MarkComponentProps
  } from '@portabletext/svelte';

  interface ImageBlockComponentProps extends CustomBlockComponentProps {
    value: {
      _key: string;
      _type: 'image';
      asset: {
        _type: string;
        _ref: string;
      };
    };
  }

  export let portableText: ImageBlockComponentProps;

  $: ({ value } = portableText);
  $: ({ _key } = value);
  $: ({ _ref } = value.asset);
</script>

<div class="w-full h-fit">
  <img src={urlFor(_ref).width(500).fit('crop').url()} class="" alt={_key} />
</div>
