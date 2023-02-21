<div class="quoteContainer">
  <div class="quoteBar" />
  <span><slot /></span>
</div>

<style lang="scss">
  .quoteContainer {
    @apply flex w-full flex-1 items-stretch justify-start;
  }

  .quoteBar {
    @apply mr-3 block rounded-sm bg-stone-500 opacity-80;
    width: 2px;
  }

  span {
    @apply block flex-grow;
  }

  :global(.dark) {
    .quoteBar {
      @apply bg-stone-300;
    }
  }
</style>
