<script lang="ts">
  import Divider from '$components/divider.svelte';
  import MagButton from '$components/experiments/mag-cursor/button.svelte';
  import MagCursor from '$components/experiments/mag-cursor/cursor.svelte';

  let container: HTMLElement,
    containerRect: DOMRect,
    targets: HTMLElement[] = [],
    snappedIdx: number | undefined = undefined;

  const register = (element: HTMLElement) => targets.push(element);

  const buttons = ['Button One', 'Button Two', 'Button Three'];

  $: containerRect = container?.getBoundingClientRect();
</script>

<article
  class="relative my-6 block cursor-none rounded-lg bg-dark/5 px-7 py-6 shadow-2xl shadow-dark/5 transition-shadow focus-within:shadow-dark/10 hover:shadow-dark/10 dark:bg-light/5 dark:shadow-light/5"
  bind:this={container}
>
  <header class="w-full pb-2">
    <h3 class="pb-2 text-2xl font-bold">Magnetic cursor</h3>
    <p>A simple magnetic cursor effect. Hover over the buttons to try it out.</p>
    <Divider />
  </header>
  <figure class="h-fit w-full overflow-hidden">
    <div class="flex w-full flex-row items-center justify-center pb-6 pt-5">
      {#each buttons as label, i}
        <MagButton {label} {register} active={i === snappedIdx} />
      {/each}
    </div>

    <MagCursor {targets} {containerRect} bind:snapped={snappedIdx} />
  </figure>
</article>
