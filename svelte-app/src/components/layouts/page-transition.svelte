<script lang="ts">
  import { circIn, circOut } from 'svelte/easing';
  import { derived } from 'svelte/store';
  import { blur, fly } from 'svelte/transition';

  import { onNav } from '$helpers/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { isMobile } from '$lib/helpers/responsive';
  import Settings from '$stores/settings';

  export let pathname: string | undefined;

  const { reduce_motion } = Settings;

  const dist = 26,
    duration = BASE_ANIMATION_DURATION * 0.75,
    transitionIn = derived(reduce_motion, (value) => {
      return value
        ? (node: Element) => blur(node, { duration, delay: duration, opacity: 0.2 })
        : (node: Element) =>
            fly(node, {
              duration: duration * 2,
              delay: duration,
              easing: circOut,
              x: (!$isMobile && (direction === 'backward' ? -dist : dist)) || undefined,
              y: ($isMobile && (direction === 'backward' ? -dist : dist)) || undefined,
              opacity: 0
            });
    }),
    transitionOut = derived(reduce_motion, (value) => {
      return value
        ? (node: Element) => blur(node, { duration, opacity: 0.2 })
        : (node: Element) =>
            fly(node, {
              duration,
              easing: circIn,
              x: (!$isMobile && (direction === 'backward' ? dist : -dist)) || undefined,
              y: ($isMobile && (direction === 'backward' ? dist : -dist)) || undefined,
              opacity: 0
            });
    });

  $: direction = onNav(pathname || '');
</script>

<!-- TODO: This method is broken (& has been for a while), see https://github.com/sveltejs/svelte/issues/6152 -->
<!-- For now, the alternative is to not use a Key block, and simply import this component -->
<!-- in each individual subroute... which is Not happening, lol -->
{#key pathname}
  <div in:$transitionIn out:$transitionOut>
    <slot />
  </div>
{/key}
