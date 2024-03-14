<script lang="ts">
  import { linkTo, t } from '$lib/i18n';

  import Confetti from '$components/nav/confetti.svelte';

  let clicks = 0,
    showConfetti = false,
    clickTimeout: ReturnType<typeof setTimeout>;

  const handleClick = () => {
    clearTimeout(clickTimeout);
    clicks++;

    if (clicks >= 3) {
      showConfetti = true;
    }

    clickTimeout = setTimeout(() => (clicks = 0), 500);
  };
</script>

<span class="relative h-fit w-fit">
  <a
    class="focus-outline-sm w-fit select-none rounded-sm font-code text-xl font-extrabold transition-[color]"
    href={$linkTo(clicks < 3 ? '/' : '/experiments')}
    aria-label={$t('Home')}
    on:click={handleClick}
  >
    kio.dev
  </a>

  {#if showConfetti}
    <Confetti on:done={() => (showConfetti = false)} />
  {/if}
</span>
