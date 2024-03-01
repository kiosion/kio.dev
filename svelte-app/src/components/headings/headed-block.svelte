<script lang="ts">
  export let heading: string,
    testId: string | undefined = undefined;
</script>

<section data-test-id={testId}>
  <h1>{heading}</h1>
  <div><slot /></div>
</section>

<style lang="scss">
  @import '@styles/mixins';

  h1 {
    @apply mb-2 mt-8 font-code text-2xl font-black;
  }

  section {
    @apply transition-colors;

    div {
      @apply mx-1 font-sans text-base text-dark/90;

      @include dark {
        @apply text-light/90;
      }
    }
  }
</style>
