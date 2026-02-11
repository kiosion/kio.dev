<script lang="ts">
  const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  let spinnerFrame = $state(0);

  $effect(() => {
    const interval = setInterval(() => {
      spinnerFrame = (spinnerFrame + 1) % SPINNER_FRAMES.length;
    }, 80);
    return () => clearInterval(interval);
  });

  let { text = 'loading' }: { text?: string } = $props();
</script>

<div class="font-mono text-sm opacity-70">
  {SPINNER_FRAMES[spinnerFrame]}{#if text?.trim()}&nbsp;{text}&hellip;{/if}
</div>
