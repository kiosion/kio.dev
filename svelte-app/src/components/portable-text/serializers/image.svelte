<script lang="ts">
  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { SanityImageObject } from '@sanity/image-url/lib/types/types';
  import ErrorBoundary from '$components/error-boundary.svelte';
  import Image from '$components/images/image.svelte';
  import ConstrainWidth from '$components/layouts/constrain-width.svelte';

  export let portableText: Omit<CustomBlockComponentProps, 'value'> & {
    value: SanityImageObject & { _key: string };
  };
</script>

<ConstrainWidth>
  <ErrorBoundary>
    <Image image={portableText.value} />
  </ErrorBoundary>
</ConstrainWidth>
