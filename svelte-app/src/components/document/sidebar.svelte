<script lang="ts">
  import type { Heading } from '$helpers/pt';
  import Inner from '$components/document/sidebar/inner.svelte';
  import SidebarToggle from '$components/document/sidebar/toggle.svelte';
  import { sidebarOpen } from '$stores/navigation';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS } from '$lib/consts';

  export let headings: Heading[];
</script>

<div
  class="sticky self-start w-max top-0 h-fit {$sidebarOpen
    ? 'mr-8'
    : 'mr-0'} transition-[margin]"
  aria-hidden={!$sidebarOpen}
>
  <SidebarToggle showText={true} />
  <div
    class="relative flex flex-col gap-8 mt-6 transition-[width,opacity] {$sidebarOpen
      ? 'w-64 opacity-100'
      : 'w-0 opacity-0'} h-fit"
  >
    <Inner {headings} />
  </div>
</div>
