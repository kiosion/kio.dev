<script lang="ts">
  import Icon from '@iconify/svelte';

  export let icon: string;
  export let href: string | undefined;
  export let target = '_blank';
  export let label = '';
  export let mousePos = [0, 0];
  export let classes = '';

  let hovered = false;
  let container: HTMLElement;
  let glow: HTMLElement;

  $: [clientX, clientY] = mousePos;

  const mouseMove = () => {
    try {
      const { top, left } = container.getBoundingClientRect();
      glow.style && (glow.style.left = `${clientX - left}px`);
      glow.style && (glow.style.top = `${clientY - top}px`);
    } catch {
      () => undefined;
    }
  };

  $: clientX, clientY, mouseMove();
</script>

<div
  class="relative p-[1px] overflow-hidden rounded-md {hovered ? 'active' : ''}"
  bind:this={container}
>
  <div
    class="p-[4px] bg-slate-100 dark:bg-slate-800 rounded-md w-[26px] h-[26px]"
  >
    <a
      class="flex items-center justify-center w-full h-full"
      href={href ? href : '#'}
      {target}
      aria-label={label}
      on:mouseenter={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
    >
      <Icon {icon} class={classes} />
    </a>
  </div>
  <div bind:this={glow} class="absolute unfilled w-[800px] h-[800px]" />
  <div
    class="absolute filled top-[-2px] left-[-2px] w-[140%] h-[140%] bg-slate-400 {hovered
      ? '!opacity-60'
      : ''} opacity-0 rounded-md"
  />
</div>

<style lang="scss">
  .filled {
    z-index: -2;
  }
  .cover,
  .filled {
    transition: opacity 150ms cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .unfilled {
    z-index: -1;
    top: -9999px;
    left: -9999px;
    background: radial-gradient(#94a3b8, transparent 35%);
    transform: translate(-50%, -50%);
  }
</style>
