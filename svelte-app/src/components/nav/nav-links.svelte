<script lang="ts">
  import { navLinks } from '$stores/navigation';

  import NavLink from '$components/nav/nav-link.svelte';
  import SliderIndicator from '$components/nav/slider-indicator.svelte';

  let navLinksContainer: HTMLElement;
</script>

<div
  id="nav-links"
  class="relative flex flex-col items-start text-base"
  aria-label="Navigation links"
  role="menubar"
  bind:this={navLinksContainer}
>
  {#each $navLinks as link, index}
    <NavLink {link} {index} />
  {/each}
  <SliderIndicator container={navLinksContainer} />
</div>
