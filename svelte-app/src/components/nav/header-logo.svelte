<script lang="ts">
  import { writable } from 'svelte/store';

  import { linkTo, t } from '$lib/i18n';

  import Confetti from '$components/nav/confetti.svelte';

  let clicks = 0,
    clickTimeout: ReturnType<typeof setTimeout>;

  const confetti = writable<{ id: number; done: boolean }[]>([]);

  const handleClick = () => {
    clearTimeout(clickTimeout);
    clicks++;

    if (clicks >= 3) {
      confetti.update((c) => {
        c.push({ id: Math.floor(Date.now() + Math.random() * 1000), done: false });
        return c;
      });
      clickTimeout = setTimeout(() => {
        clicks = 0;
      }, 1500);
    } else {
      clickTimeout = setTimeout(() => {
        clicks = 0;
      }, 500);
    }
  };

  $: $confetti?.every?.((c) => c.done) && confetti.set([]);
</script>

<span class="relative h-fit w-fit">
  <a
    class="focus-outline-sm w-fit select-none rounded-sm font-code text-lg font-extrabold transition-[color]"
    href={$linkTo('/')}
    aria-label={$t('Home')}
    on:click={handleClick}>kio.dev</a
  >

  {#each $confetti as { id }}
    <Confetti
      key={id}
      on:done={(e) =>
        confetti.update((c) =>
          c.map((i) => (i.id === e.detail ? { id: e.detail, done: true } : i))
        )}
    />
  {/each}
</span>
