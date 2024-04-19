<script lang="ts">
  import Image from '$components/images/image.svelte';
  import ConstrainWidth from '$components/layouts/constrain-width.svelte';

  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { RouteFetch, SanityImageObject } from '$types';

  export let portableText: Omit<CustomBlockComponentProps, 'value'> & {
    value: SanityImageObject;
  };

  const routeFetch = portableText.global.context.routeFetch as RouteFetch;
</script>

<ConstrainWidth class="px-6 md:px-10">
  <Image image={portableText.value} {routeFetch}></Image>
</ConstrainWidth>
