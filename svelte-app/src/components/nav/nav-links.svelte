<script lang="ts">
  import NewNavLink from '$components/nav/new-nav-link.svelte';
  import SliderIndicator from '$components/nav/slider-indicator.svelte';
  import { navLinks } from '$stores/navigation';

  let navLinksContainer: HTMLElement;
</script>

<div bind:this={navLinksContainer}>
  <ul class="relative flex flex-col items-start pt-5 text-base">
    {#each $navLinks as link, index}
      <NewNavLink {link} {index} />
    {/each}
    <SliderIndicator container={navLinksContainer} />
  </ul>
</div>
