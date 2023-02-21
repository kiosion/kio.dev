<script lang="ts">
  import { maybe } from 'svelte-maybe-transition';
  import { quartIn, quartOut } from 'svelte/easing';
  import Features from '$stores/features';
  import { onNav } from '$helpers/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  export let url: URL | undefined;

  const dist = 18,
    duration = BASE_ANIMATION_DURATION;

  let navDir: 'forward' | 'backward' = 'forward';

  $: ({ pathname } = url || { pathname: '' });
  $: navDir = onNav(pathname);
  $: reduceMotion = Features.can('reduce motion');
</script>

<!-- TODO: This method is broken (& has been for a while), see https://github.com/sveltejs/svelte/issues/6152 -->
<!-- For now, the alternative is to not use a Key block, and simply import this component -->
<!-- in each individual subroute... which is Not happening, lol -->
{#key pathname}
  <div
    class="absolute top-0 left-0 h-full w-full"
    in:maybe={{
      enable: true,
      fn: $reduceMotion ? 'fade' : 'fly',
      delay: duration,
      duration: duration * 2,
      easing: quartOut,
      y: navDir === 'backward' ? -dist : dist
    }}
    out:maybe={{
      enable: true,
      fn: $reduceMotion ? 'fade' : 'fly',
      duration,
      easing: quartIn,
      y: navDir === 'backward' ? dist : -dist
    }}
  >
    <slot />
  </div>
{/key}
