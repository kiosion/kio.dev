<script lang="ts">
  export let classNames = '',
    fixed = false,
    wide = false;
</script>

{#if fixed}
  <div class:wide class="fixedPos {classNames}">
    <slot />
  </div>
{:else}
  <div
    class="md:w-[32rem] md:max-w-none md:px-0 lg:w-[38rem] xl:w-[46rem] 2xl:w-[52rem] {classNames}"
  >
    <slot />
  </div>
{/if}

<style lang="scss">
  div {
    &:not(.fixedPos) {
      @apply mx-auto mb-8 w-full max-w-[28rem] px-4 pb-12 transition-[transform];
    }
    &.fixedPos {
      @apply w-full max-w-[42rem] pb-20;

      &.wide {
        @apply max-w-[64rem];
      }
    }
  }
</style>
