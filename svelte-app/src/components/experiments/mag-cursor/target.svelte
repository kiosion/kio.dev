<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  import { browser } from '$app/environment';

  const dispatch = createEventDispatcher<{
    mount: { element: HTMLElement | undefined; id: string; snapDistance?: number };
  }>();

  export const id = Math.random().toString(36).slice(4);

  export let activeTarget: string | undefined = undefined,
    snapDistance: number | undefined = undefined;

  let element: HTMLElement;

  const getFirstPositionedChild = (el: HTMLElement): HTMLElement | undefined => {
    if (!browser) {
      return undefined;
    }

    const firstChild = el.firstElementChild as HTMLElement;

    if (!firstChild) {
      return undefined;
    }

    const style = window.getComputedStyle(firstChild);

    if (style.display === 'none' || style.display === 'contents') {
      return getFirstPositionedChild(firstChild);
    }

    return firstChild;
  };

  onMount(() =>
    dispatch('mount', {
      element: getFirstPositionedChild(element),
      snapDistance,
      id
    })
  );

  $: active = activeTarget === id;
</script>

<div class="contents" bind:this={element}>
  <slot {active} {id} />
</div>
