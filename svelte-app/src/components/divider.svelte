<span />

<style lang="scss">
  span {
    @apply my-6 block h-[1px] w-full bg-dark/30 transition-[background-color] duration-75;
  }

  :global(.dark) {
    span {
      @apply bg-light/30;
    }
  }
</style>
