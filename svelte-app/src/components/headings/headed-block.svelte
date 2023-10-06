<script lang="ts">
  export let heading: string;
</script>

<section class={$$props.class || undefined}>
  <h1>{heading}</h1>
  <div>
    <slot />
  </div>
</section>

<style lang="scss">
  h1 {
    @apply mb-2 mt-8 font-code text-3xl font-black;
  }

  section {
    @apply transition-colors;

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
