<script lang="ts">
  export let width = '200px';
  export let height = '4px';
</script>

<div class="wrapper" style="width: {width}; height: {height};">
  <div data-test-id="loader-bar">
    {#each Array(7) as _}
      <div
        class="bg-violet-300 shadow-[0_0_16px_var(--tw-shadow)] shadow-violet-300"
      />
    {/each}
  </div>
</div>

<style lang="scss">
  .wrapper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;

    > div {
      height: 100%;
      display: flex;
      transform: translateZ(0);

      div {
        flex: 1;
        animation: pulse 700ms infinite alternate ease;

        @for $i from 1 through 8 {
          &:nth-child(#{$i}) {
            animation-delay: -(calc(700ms / 8) * (8 - $i));
          }
        }
      }
    }
  }

  @keyframes pulse {
    100% {
      background: transparent;
      flex: 10;
      box-shadow: 0 0 0 transparent;
    }
  }
</style>
