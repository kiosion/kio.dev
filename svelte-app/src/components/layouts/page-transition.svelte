<script lang="ts">
  import { circIn, circOut } from 'svelte/easing';
  import { derived } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';

  import { onNav } from '$helpers/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import Settings from '$stores/settings';

  export let pathname: string | undefined;

  const { reduce_motion } = Settings;

  let navDir: 'forward' | 'backward' = 'forward';

  const dist = 26,
    duration = BASE_ANIMATION_DURATION / 1.5,
    transitionIn = derived(reduce_motion, (value) => {
      return value
        ? (node: Element) => fade(node, { duration })
        : (node: Element) =>
            fly(node, {
              duration: duration * 2,
              delay: duration,
              easing: circOut,
              x: navDir === 'backward' ? -dist : dist,
              opacity: 0
            });
    }),
    transitionOut = derived(reduce_motion, (value) => {
      return value
        ? (node: Element) => fade(node, { duration })
        : (node: Element) =>
            fly(node, {
              duration,
              easing: circIn,
              x: navDir === 'backward' ? dist : -dist,
              opacity: 0
            });
    });

  $: navDir = onNav(pathname || '');
</script>

<!-- TODO: This method is broken (& has been for a while), see https://github.com/sveltejs/svelte/issues/6152 -->
<!-- For now, the alternative is to not use a Key block, and simply import this component -->
<!-- in each individual subroute... which is Not happening, lol -->
{#key pathname}
  <div in:$transitionIn out:$transitionOut>
    <slot />
  </div>
{/key}

<style lang="scss">
  div {
    @apply absolute left-0 top-0 h-full w-full;
  }
</style>
