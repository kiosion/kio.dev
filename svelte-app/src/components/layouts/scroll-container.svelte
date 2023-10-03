<script lang="ts">
  import { afterNavigate } from '$app/navigation';

  export let element: HTMLDivElement;

  afterNavigate(() => {
    element.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
</script>

<div
  class="relative h-full w-full overflow-visible overflow-x-clip overflow-y-scroll p-8"
  tabindex="-1"
  role="none"
  bind:this={element}
>
  <slot />
</div>
