<script lang="ts">
  import { fionaPlaceholder } from '$helpers/placeholders';

  import seedrandom from 'seedrandom';

  export let seed: string | undefined,
    width: number,
    height: number,
    classNames = '',
    alt = 'Placeholder image';

  $: rng = (seed: string | undefined) => seedrandom(seed)().toString();
  $: src = fionaPlaceholder(rng(seed), { width, height });
</script>

<img {src} {width} {height} {alt} class={classNames} />
