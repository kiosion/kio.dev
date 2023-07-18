<script lang="ts">
  import { navLinks } from '$stores/navigation';

  import NavLink from '$components/nav/nav-link.svelte';
  import SliderIndicator from '$components/nav/slider-indicator.svelte';

  let navLinksContainer: HTMLElement;
</script>

<div bind:this={navLinksContainer}>
  <ul>
    {#each $navLinks as link, index}
      <NavLink {link} {index} />
    {/each}
    <SliderIndicator container={navLinksContainer} />
  </ul>
</div>

<style lang="scss">
  ul {
    @apply relative mt-5 flex flex-col items-start text-base;
  }
</style>
