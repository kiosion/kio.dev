<script lang="ts">
  import { circIn, circOut } from 'svelte/easing';

  import { maybe } from 'svelte-maybe-transition';

  import { onNav } from '$helpers/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import Settings from '$stores/settings';

  export let pathname: string | undefined;

  const { reduce_motion } = Settings;

  const dist = 26,
    duration = BASE_ANIMATION_DURATION / 1.5;

  let navDir: 'forward' | 'backward' = 'forward';

  $: navDir = onNav(pathname || '');
</script>

<!-- TODO: This method is broken (& has been for a while), see https://github.com/sveltejs/svelte/issues/6152 -->
<!-- For now, the alternative is to not use a Key block, and simply import this component -->
<!-- in each individual subroute... which is Not happening, lol -->
{#key pathname}
  <div
    class="absolute left-0 top-0 h-full w-full"
    in:maybe={{
      enable: true,
      fn: $reduce_motion ? 'fade' : 'fly',
      delay: duration,
      duration: duration * 2,
      x: navDir === 'backward' ? -dist : dist,
      easing: circOut
    }}
    out:maybe={{
      enable: true,
      fn: $reduce_motion ? 'fade' : 'fly',
      duration,
      x: navDir === 'backward' ? dist : -dist,
      easing: circIn
    }}
  >
    <slot />
  </div>
{/key}
