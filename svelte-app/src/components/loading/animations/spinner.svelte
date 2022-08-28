<div>
  {#each Array(6) as item}
    <div />
  {/each}
</div>

<style lang="scss">
  div {
    width: 40px;
    height: 40px;
    position: relative;
    animation: chase 2.5s infinite linear both;

    div {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      animation: chase-dot 2s infinite ease-in-out both;

      &:before {
        content: '';
        display: block;
        width: 25%;
        height: 25%;
        background-color: #f1f5f9;
        border-radius: 9999px;
        animation: chase-dot-before 2s infinite ease-in-out both;
      }

      &:nth-child(1) {
        &,
        &:before {
          animation-delay: -1.1s;
        }
      }
      &:nth-child(2) {
        &,
        &:before {
          animation-delay: -1s;
        }
      }
      &:nth-child(3) {
        &,
        &:before {
          animation-delay: -0.9s;
        }
      }
      &:nth-child(4) {
        &,
        &:before {
          animation-delay: -0.8s;
        }
      }
      &:nth-child(5) {
        &,
        &:before {
          animation-delay: -0.7s;
        }
      }
      &:nth-child(6) {
        &,
        &:before {
          animation-delay: -0.6s;
        }
      }
    }
  }

  @keyframes chase {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes chase-dot {
    80%,
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes chase-dot-before {
    50% {
      transform: scale(0.4);
    }
    100%,
    0% {
      transform: scale(1);
    }
  }
</style>
