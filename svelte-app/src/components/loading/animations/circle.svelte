<div>
  <svg viewBox="0 0 80 80">
    <circle cx="40" cy="40" r="32" />
  </svg>
</div>

<style lang="scss">
  div {
    width: 44px;
    height: 44px;
    position: relative;
    display: inline-block;
    box-sizing: border-box;

    --pathDark: #cbd5e1;
    --dotDark: #6ee7b7;
    --duration: 3s;

    &:before {
      background: var(--dotDark);
      content: '';
      box-sizing: border-box;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: absolute;
      display: block;
      top: 37px;
      left: 19px;
      transform: translate(-18px, -18px);
      animation: dotRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite
        reverse;
    }
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
    circle {
      stroke: var(--pathDark);
      fill: none;
      stroke-width: 10px;
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-dasharray: calc(200 / 4 * 3) calc(200 / 4) calc(200 / 4 * 3) calc(200 / 4);
      stroke-dashoffset: 75;
      animation: pathCircle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
        infinite reverse;
    }
  }

  @keyframes dotRect {
    25% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(18px, -18px);
    }
    75% {
      transform: translate(0, -36px);
    }
    100% {
      transform: translate(-18px, -18px);
    }
  }

  @keyframes pathCircle {
    25% {
      stroke-dashoffset: 125;
    }
    50% {
      stroke-dashoffset: 175;
    }
    75% {
      stroke-dashoffset: 225;
    }
    100% {
      stroke-dashoffset: 275;
    }
  }
</style>
