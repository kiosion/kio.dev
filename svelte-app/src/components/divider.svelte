<span />

<style lang="scss">
  span {
    @apply my-6 block h-[1px] w-full bg-dark/40 transition-[background-color] duration-75;
  }

  :global(.dark) {
    span {
      @apply bg-light/40;
    }
  }
</style>
