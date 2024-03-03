<script lang="ts">
  export let heading: string,
    testId: string | undefined = undefined;

  export const id = Math.random().toString(36).substring(2);
</script>

<section {id} data-test-id={testId}>
  <h1 id="{id}-heading">{heading}</h1>
  <div><slot {id} /></div>
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
