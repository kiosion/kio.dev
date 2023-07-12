<script lang="ts">
  import IconHeader from '$components/headings/icon-header.svelte';

  export let icon: string, heading: string;
</script>

<section>
  <IconHeader {icon} text={heading} />
  <div>
    <slot />
  </div>
</section>

<style lang="scss">
  section {
    div {
      @apply mx-1 font-sans text-base text-dark/90;
    }
  }

  :global(.dark) {
    section {
      div {
        @apply text-light/90;
      }
    }
  }
</style>
