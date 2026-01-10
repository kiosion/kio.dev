<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';
  import type { PortableTextMarkDefinition } from '@portabletext/types';
  import Link from '$components/link.svelte';

  type CustomLinkMarkDef = PortableTextMarkDefinition & {
    href: string;
    newtab?: boolean;
  };

  let { portableText }: { portableText: MarkComponentProps<CustomLinkMarkDef> } =
    $props();

  const value = $derived(portableText.value);
  const plainTextContent = $derived(portableText.plainTextContent);
</script>

<Link href={value.href} target={value.newtab ? '_blank' : undefined} showTooltip>
  {plainTextContent}
</Link>
