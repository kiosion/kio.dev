<script lang="ts">
  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { SanityImageObject } from '@sanity/image-url/lib/types/types';
  import ErrorBoundary from '$components/error-boundary.svelte';
  import Image from '$components/images/image.svelte';
  import ConstrainWidth from '$components/layouts/constrain-width.svelte';
  import type { RouteFetch } from '$types';

  export let portableText: Omit<CustomBlockComponentProps, 'value'> & {
    value: SanityImageObject & { _key: string };
  };

  const routeFetch = portableText.global.context.routeFetch as RouteFetch;
</script>

<ConstrainWidth class="px-6 md:px-10">
  <ErrorBoundary>
    <Image image={portableText.value} {routeFetch} />
  </ErrorBoundary>
</ConstrainWidth>
