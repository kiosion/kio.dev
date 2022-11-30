<script lang="ts">
  import { maybe } from '$helpers/animate';
  import { quartIn, quartOut } from 'svelte/easing';
  import Features from '$stores/features';
  import { onNav } from '$helpers/navigation';

  export let url: URL | undefined;

  const dist = 10,
    duration = 200;

  let navDir: 'forward' | 'backward' = 'forward';

  $: ({ pathname } = url || { pathname: '' });
  $: navDir = onNav(pathname);
  $: CanUseReduceMotion = Features.can('use reduce motion feature');
</script>

{#key pathname}
  <div
    class="absolute top-0 left-0 w-full h-full"
    in:maybe={{
      animate: !$CanUseReduceMotion,
      fn: 'fly',
      delay: duration,
      duration: duration * 2,
      easing: quartOut,
      y: navDir === 'backward' ? -dist : dist
    }}
    out:maybe={{
      animate: !$CanUseReduceMotion,
      fn: 'fly',
      duration,
      easing: quartIn,
      y: navDir === 'backward' ? dist : -dist
    }}
  >
    <slot />
  </div>
{/key}
