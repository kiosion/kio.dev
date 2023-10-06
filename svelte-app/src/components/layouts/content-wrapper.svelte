<script lang="ts">
  import { shouldShowSummary } from '$lib/summary';

  export let wide = false;
</script>

<div id="content-wrapper" class:wide class:split={$shouldShowSummary}>
  <slot />
</div>

<style lang="scss">
  @import '@styles/mixins';

  div {
    @apply w-full px-2 pb-12 transition-[max-width,margin] duration-200;

    --max-width: unset;

    @include media(lg) {
      --max-width: 40rem;
    }
    @include media(xl) {
      @apply duration-300;
      --max-width: 48rem;
    }
    @include media(2xl) {
      --max-width: 52rem;
    }

    &.wide {
      @include media(lg) {
        --max-width: 48rem;
      }
      @include media(xl) {
        --max-width: 56rem;
      }
      @include media(2xl) {
        --max-width: 64rem;
      }
    }

    max-width: var(--max-width);
    margin-left: calc((100% - var(--max-width)) / 2);
    margin-right: calc((100% - var(--max-width)) / 2);

    &.split {
      margin-right: 0rem;
      margin-left: calc(100% - var(--max-width));
    }
  }
</style>
