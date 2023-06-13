<script lang="ts">
  import { backIn, backOut } from 'svelte/easing';

  import { maybe } from 'svelte-maybe-transition';

  import { onNav } from '$helpers/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import Settings from '$stores/settings';

  export let url: URL | undefined;

  const { reduceMotion } = Settings;

  const dist = 16,
    duration = BASE_ANIMATION_DURATION;

  let navDir: 'forward' | 'backward' = 'forward';

  $: ({ pathname } = url || { pathname: '' });
  $: navDir = onNav(pathname);
</script>

<!-- TODO: This method is broken (& has been for a while), see https://github.com/sveltejs/svelte/issues/6152 -->
<!-- For now, the alternative is to not use a Key block, and simply import this component -->
<!-- in each individual subroute... which is Not happening, lol -->
{#key pathname}
  <div
    in:maybe={{
      enable: true,
      fn: $reduceMotion ? 'fade' : 'fly',
      delay: duration,
      duration: duration * 2,
      easing: backOut,
      y: navDir === 'backward' ? -dist : dist
    }}
    out:maybe={{
      enable: true,
      fn: $reduceMotion ? 'fade' : 'fly',
      duration,
      easing: backIn,
      y: navDir === 'backward' ? dist : -dist
    }}
  >
    <slot />
  </div>
{/key}

<style lang="scss">
  div {
    @apply absolute top-0 left-0 h-full w-full;
  }
</style>
