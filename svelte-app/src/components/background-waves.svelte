<script lang="ts">
  interface Colors {
    g1: [string, string];
    g2: [string, string];
    g3: [string, string];
    g4: [string, string];
    g5: [string, string];
  }

  export let classes: string;
  let colors: Colors = {
    g1: ['#17232d', '#343f52'],
    g2: ['#595d7a', '#343f52'],
    g3: ['#595d7a', '#867aa2'],
    g4: ['#1e293b', '#867aa2'],
    g5: ['#1e293b', '#f3b4f0']
  };

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1715' height='1315' preserveAspectRatio='xMinYMin' viewBox='0 0 1715 1315'>
      <g transform='translate(857.5,657.5) translate(-857.5,-657.5)'><defs>
        <linearGradient id='lg-0' x1='0' x2='1' y1='0' y2='0'>
        <stop stop-color='${colors.g1[0]}' offset='0.25'></stop>
        <stop stop-color='${colors.g1[1]}' offset='0.75'></stop>
        </linearGradient>
      </defs>
      <path d='M0 -197.25 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 486.54999999999995 c691.75 -394.5 -2406.75 394.5 -1715 0Z' fill='url(#lg-0)' stroke='none'>
      <animate attributeName='d' repeatCount='indefinite' dur='2s' begin='0s' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1' keyTimes='0;0.5;1' values='M0 -197.25 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 486.54999999999995 c691.75 -394.5 -2406.75 394.5 -1715 0Z;M0 -197.25 c691.75 394.5 1023.25 -394.5 1715 0
      L1715 486.54999999999995 c165.75 -394.5 -1880.75 394.5 -1715 0Z;M0 -197.25 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 486.54999999999995 c691.75 -394.5 -2406.75 394.5 -1715 0Z'></animate>
      </path><defs>
        <linearGradient id='lg-1' x1='0' x2='1' y1='0' y2='0'>
        <stop stop-color='${colors.g2[0]}' offset='0.25'></stop>
        <stop stop-color='${colors.g2[1]}' offset='0.75'></stop>
        </linearGradient>
      </defs>
      <path d='M0 144.64999999999998 c691.75 394.5 1023.25 -394.5 1715 0
      L1715 828.45 c165.75 -394.5 -1880.75 394.5 -1715 0Z' fill='url(#lg-1)' stroke='none'>
      <animate attributeName='d' repeatCount='indefinite' dur='2s' begin='-0.4s' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1' keyTimes='0;0.5;1' values='M0 144.64999999999998 c691.75 394.5 1023.25 -394.5 1715 0
      L1715 828.45 c165.75 -394.5 -1880.75 394.5 -1715 0Z;M0 144.64999999999998 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 828.45 c691.75 -394.5 -2406.75 394.5 -1715 0Z;M0 144.64999999999998 c691.75 394.5 1023.25 -394.5 1715 0
      L1715 828.45 c165.75 -394.5 -1880.75 394.5 -1715 0Z'></animate>
      </path><defs>
        <linearGradient id='lg-2' x1='0' x2='1' y1='0' y2='0'>
        <stop stop-color='${colors.g3[0]}' offset='0.25'></stop>
        <stop stop-color='${colors.g3[1]}' offset='0.75'></stop>
        </linearGradient>
      </defs>
      <path d='M0 486.54999999999995 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 1170.35 c691.75 -394.5 -2406.75 394.5 -1715 0Z' fill='url(#lg-2)' stroke='none'>
      <animate attributeName='d' repeatCount='indefinite' dur='2s' begin='-0.8s' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1' keyTimes='0;0.5;1' values='M0 486.54999999999995 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 1170.35 c691.75 -394.5 -2406.75 394.5 -1715 0Z;M0 486.54999999999995 c691.75 394.5 1023.25 -394.5 1715 0
      L1715 1170.35 c165.75 -394.5 -1880.75 394.5 -1715 0Z;M0 486.54999999999995 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 1170.35 c691.75 -394.5 -2406.75 394.5 -1715 0Z'></animate>
      </path><defs>
        <linearGradient id='lg-3' x1='0' x2='1' y1='0' y2='0'>
        <stop stop-color='${colors.g4[0]}' offset='0.25'></stop>
        <stop stop-color='${colors.g4[1]}' offset='0.75'></stop>
        </linearGradient>
      </defs>
      <path d='M0 828.45 c691.75 394.5 1023.25 -394.5 1715 0
      L1715 1512.25 c165.75 -394.5 -1880.75 394.5 -1715 0Z' fill='url(#lg-3)' stroke='none'>
      <animate attributeName='d' repeatCount='indefinite' dur='2s' begin='-1.2s' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1' keyTimes='0;0.5;1' values='M0 828.45 c691.75 394.5 1023.25 -394.5 1715 0
      L1715 1512.25 c165.75 -394.5 -1880.75 394.5 -1715 0Z;M0 828.45 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 1512.25 c691.75 -394.5 -2406.75 394.5 -1715 0Z;M0 828.45 c691.75 394.5 1023.25 -394.5 1715 0
      L1715 1512.25 c165.75 -394.5 -1880.75 394.5 -1715 0Z'></animate>
      </path><defs>
        <linearGradient id='lg-4' x1='0' x2='1' y1='0' y2='0'>
        <stop stop-color='${colors.g5[0]}' offset='0.25'></stop>
        <stop stop-color='${colors.g5[1]}' offset='0.75'></stop>
        </linearGradient>
      </defs>
      <path d='M0 1170.35 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 1854.15 c691.75 -394.5 -2406.75 394.5 -1715 0Z' fill='url(#lg-4)' stroke='none'>
      <animate attributeName='d' repeatCount='indefinite' dur='2s' begin='-1.6s' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1' keyTimes='0;0.5;1' values='M0 1170.35 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 1854.15 c691.75 -394.5 -2406.75 394.5 -1715 0Z;M0 1170.35 c691.75 394.5 1023.25 -394.5 1715 0
      L1715 1854.15 c165.75 -394.5 -1880.75 394.5 -1715 0Z;M0 1170.35 c165.75 394.5 1549.25 -394.5 1715 0
      L1715 1854.15 c691.75 -394.5 -2406.75 394.5 -1715 0Z'></animate>
      </path></g>
    </svg>`;
  const prop = `background:url("data:image/svg+xml,${encodeURIComponent(
    svg
  )}");`;
</script>

<div class={classes} style={prop} />

<style lang="scss">
  div {
    z-index: -1;
  }
</style>
