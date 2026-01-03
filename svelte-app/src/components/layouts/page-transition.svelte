<script lang="ts">
  import { beforeNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { getNavigationDirection, pathnameGroupKey } from '$lib/utils';
  import { circIn, circOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  let { children } = $props();

  const duration = BASE_ANIMATION_DURATION,
    dist = 6,
    key = $derived(pathnameGroupKey(page.url.pathname));

  let dir = $state(1);

  beforeNavigate((event) => {
    if (event.from?.url.pathname === event.to?.url.pathname) {
      return;
    }

    dir = getNavigationDirection(event.from?.url.pathname, event.to?.url.pathname);
  });
</script>

<div class="relative grid w-full">
  {#key key}
    <div
      class="col-start-1 row-start-1 w-full min-w-0 [grid-area:1/1]"
      in:fly={{ duration, delay: duration, easing: circOut, y: dist * dir }}
      out:fly={{ duration, easing: circIn, y: -dist * dir }}
    >
      {@render children()}
    </div>
  {/key}
</div>
