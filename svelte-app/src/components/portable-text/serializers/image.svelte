<svelte:options runes={true} />
<script lang="ts">
  import Image from '$components/images/image.svelte';

  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { RouteFetch, SanityImageObject } from '$types';

  // export let portableText: Omit<CustomBlockComponentProps, 'value'> & {
  //   value: SanityImageObject;
  // };
  const { portableText } = $props<{
    portableText: Omit<CustomBlockComponentProps, 'value'> & {
      value: SanityImageObject;
    }
  }>();

  const routeFetch = $derived(portableText.global.context.routeFetch as RouteFetch);
</script>

<Image image={portableText.value} {routeFetch} />
