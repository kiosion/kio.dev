<div class="quoteContainer">
  <div class="quoteBar" />
  <span><slot /></span>
</div>

<style lang="scss">
  .quoteContainer {
    @apply flex w-full flex-1 items-stretch justify-start;
  }

  .quoteBar {
    @apply mr-3 block rounded-sm bg-dark/40 opacity-80;
    width: 2px;
  }

  span {
    @apply block flex-grow;
  }

  :global(.dark) {
    .quoteBar {
      @apply bg-light/40;
    }
  }
</style>
