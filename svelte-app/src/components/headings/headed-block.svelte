<script lang="ts">
  export let heading: string;
</script>

<section class={$$props.class || ''}>
  <h1 class="mb-2 mt-8 font-code text-3xl font-black">{heading}</h1>
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
