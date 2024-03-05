<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import {
    activeTarget,
    cursorTargets,
    DEFAULT_NO_SNAP_DIST,
    DEFAULT_SNAP_DIST,
    getFirstPositionedChild
  } from '$lib/cursor';

  export const id = Math.random().toString(36).slice(4);

  export let snap = true,
    offset = 0,
    snapDistance: number = snap ? DEFAULT_SNAP_DIST : DEFAULT_NO_SNAP_DIST;

  let element: HTMLDivElement;

  onMount(() => {
    cursorTargets.update((targets) => [
      ...targets,
      {
        element: getFirstPositionedChild(element),
        id,
        snapDistance,
        snapFull: snap,
        sizeOffset: offset
      }
    ]);
  });

  onDestroy(() => {
    cursorTargets.update((targets) => targets.filter((t) => t.id !== id));
  });

  $: active = !!($activeTarget?.id && $activeTarget.id === id);
</script>

<div class="contents" bind:this={element}>
  <slot {active} {id} />
</div>
