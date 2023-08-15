<script lang="ts">
  import LastFM from '$lib/assets/last_fm-512.png';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import type { Data } from '$helpers/toru';

  export let data: Data;
</script>

<div
  class="mb-4 flex w-full flex-row items-center gap-3 border-b border-dark/40 pb-5 dark:border-light/40"
>
  <span class="relative h-fit w-fit flex-shrink-0">
    <img
      class="aspect-square w-12 select-none rounded-sm border border-dark/40 dark:border-light/40"
      src="data:{data.cover_art.mime_type};base64,{data.cover_art.data}"
      alt={data.title}
    />
    <Hoverable>
      <Tooltip
        text="Now playing: {data.title} - {data.artist}"
        delay={500}
        position="right"
        fixed
      >
        <a
          class="focusOutline-sm absolute block h-5 w-5 select-none rounded-full bg-light transition-[background-color] dark:bg-black"
          target="_blank"
          href="https://github.com/kiosion/toru"
          role="button"
          tabindex="0"
        >
          <img src={LastFM} alt="LastFM" class="rounded-full" />
        </a>
      </Tooltip>
    </Hoverable>
  </span>
  <div class="flex flex-col gap-2 font-sans text-dark/80 dark:text-light/90">
    <p class="line-clamp-2 text-[13px] font-bold leading-tight">
      {data.title}
    </p>
    <p class="-mt-0.5 line-clamp-2 text-[11px] leading-tight">
      {data.artist}
    </p>
  </div>
</div>

<style lang="scss">
  a {
    padding: 3px;
    bottom: -5px;
    right: -5px;
  }
</style>
