<script lang="ts">
  import { beforeNavigate } from '$app/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { getNavigationDirection } from '$lib/utils';
  import { circIn, circOut } from 'svelte/easing';
  import { fly, fade } from 'svelte/transition';

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

<div class="relative grid w-full">
  {#key pathname}
    <div
      {...$$restProps}
      class="col-start-1 row-start-1 [grid-area:1/1] w-full min-w-0"
      in:fly={{ duration, delay: duration, easing: circOut, y: dist * dir }}
      out:fly={{ duration, easing: circIn, y: -dist * dir }}
    >
      <slot />
    </div>
  {/key}
</div>
