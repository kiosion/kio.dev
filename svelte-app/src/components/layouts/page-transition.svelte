<script lang="ts">
  import { circIn, circOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  import { beforeNavigate } from '$app/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { getNavigationDirection } from '$lib/utils';

  export let pathname: string | undefined;

  const duration = BASE_ANIMATION_DURATION,
    dist = 6;

  let dir = 1;

  beforeNavigate((event) => {
    if (event.from?.url.pathname === event.to?.url.pathname) {
      return;
    }

    dir = getNavigationDirection(event.from?.url.pathname, event.to?.url.pathname);
  });
</script>

{#key pathname}
  <div
    {...$$restProps}
    in:fly={{ duration, delay: duration, easing: circOut, y: dist * dir }}
    out:fly={{ duration, easing: circIn, y: -dist * dir }}
  >
    <slot />
  </div>
{/key}
