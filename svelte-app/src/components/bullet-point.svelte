<span />

<style lang="scss">
  span {
    @apply mx-2 block h-1 w-1 flex-shrink-0 rounded-full bg-dark/80 transition-colors;
  }

  :global(.dark) {
    span {
      @apply bg-light/80;
    }
  }
</style>
