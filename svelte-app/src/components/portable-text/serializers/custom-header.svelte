<script lang="ts">
  import IconHeader from '$components/headings/icon-header.svelte';

  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { ArbitraryTypedObject } from '@portabletext/types';

  export let portableText: Omit<CustomBlockComponentProps, 'value'> & {
    value: ArbitraryTypedObject & {
      title: string;
      icon: string;
    };
  };

  $: ({ value } = portableText);
  // TODO: Validate that the value is an object w/ these expected props - not sure if this is the correct struct for a custom PT Object?
  $: ({ title, icon } = value);
</script>

<IconHeader text={title} {icon} />
