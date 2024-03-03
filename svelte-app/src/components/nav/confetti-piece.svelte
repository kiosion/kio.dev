<script lang="ts">
  export let index = 0;

  const colours = [
      'bg-rose-400',
      'bg-yellow-400',
      'bg-green-400',
      'bg-cyan-400',
      'bg-violet-400',
      'bg-pink-400'
    ],
    spreadX = 100,
    spreadY = 150;
</script>

<div
  class={colours[index % 5]}
  style="--x-end: {Math.random() * 2 * spreadX - spreadX}px; --y-end: {Math.random() *
    2 *
    spreadY -
    spreadY / 2}px;"
/>

<style lang="scss">
  div {
    @apply absolute h-1 w-1 opacity-0;

    animation: explode 1s ease-out forwards;
  }

  @keyframes explode {
    from {
      opacity: 1;
      transform: translate(0, 0) rotate(0);
    }
    to {
      opacity: 0;
      transform: translate(var(--x-end, 0px), var(--y-end, -400px)) rotate(360deg);
    }
  }
</style>
