<div id={$$props.id ?? undefined}>
  <slot />
</div>

<style lang="scss">
  @import '@styles/mixins';

  div {
    @apply w-full transition-[max-width,margin] duration-200;

    --max-width: unset;

    @include media(lg) {
      --max-width: 46rem;
    }
    @include media(xl) {
      --max-width: 52rem;
    }
    @include media(2xl) {
      --max-width: 56rem;
    }

    max-width: var(--max-width);
    margin-left: calc((100% - var(--max-width)) / 2);
    margin-right: calc((100% - var(--max-width)) / 2);
  }
</style>
