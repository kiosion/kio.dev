<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';

  import {
    activeTarget,
    BASE_TWEEN_MS,
    cursorTargets,
    DEFAULT_NO_SNAP_DIST,
    DEFAULT_SNAP_DIST,
    getFirstPositionedChild
  } from '$components/experiments/mag-cursor/utils';

  export const id = Math.random().toString(36).slice(4);

  export let snap = true,
    size = 0,
    distance = snap ? DEFAULT_SNAP_DIST : DEFAULT_NO_SNAP_DIST;

  let element: HTMLDivElement;

  onMount(() => {
    cursorTargets.update((targets) => [
      ...targets,
      {
        id,
        element: getFirstPositionedChild(element),
        snap,
        snapDist: distance,
        size,
        offset: tweened([0, 0], {
          duration: BASE_TWEEN_MS,
          easing: cubicOut
        })
      }
    ]);
  });

  onDestroy(() => {
    cursorTargets.update((targets) => targets.filter((t) => t.id !== id));
  });

  $: active = !!($activeTarget?.id && $activeTarget.id === id);
  $: tweenedOffset = $cursorTargets.find((t) => t.id === id)?.offset;
</script>

<div class="contents" bind:this={element}>
  <slot {active} {id} offset={$tweenedOffset} />
</div>
