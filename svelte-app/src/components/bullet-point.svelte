<div class={$$props.class || ''} />

<style lang="scss">
  div {
    @apply mx-2 block h-1 w-1 flex-shrink-0 rounded-full bg-dark/80 transition-all duration-150;
  }

  :global(.dark) {
    div {
      @apply bg-light/80;
    }
  }
</style>
