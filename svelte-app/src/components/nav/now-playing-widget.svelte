<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';
  import LastFM from '$lib/assets/last_fm-512.png';
  import type { Data } from '$helpers/toru';

  export let data: Data;
</script>

<div class="mb-4 border-b border-stone-400/50 pb-4 dark:border-stone-500/60">
  <div class="flex w-full flex-row items-start gap-3 pt-4">
    <span class="relative h-fit w-fit flex-shrink-0">
      <img
        class="aspect-square w-12 rounded-sm"
        src="data:{data.cover_art.mime_type};base64,{data.cover_art.data}"
        alt={data.title}
      />
      <Hoverable>
        <Tooltip
          text="LastFM: {data.title} - {data.artist}"
          delay={500}
          position="right"
          fixed
        >
          <img
            src={LastFM}
            alt=""
            class="absolute -bottom-0.5 -right-0.5 h-4 w-4"
            on:click={() => {
              window.open('https://github.com/kiosion/toru', '_blank');
            }}
            on:keydown={(e) => {
              if (e.key === 'Enter') {
                window.open('https://github.com/kiosion/toru', '_blank');
              }
            }}
          />
        </Tooltip>
      </Hoverable>
    </span>
    <div
      class="flex flex-col gap-2 font-sans text-stone-700 dark:text-stone-200"
    >
      <p class="text-[13px] font-bold leading-tight line-clamp-2">
        {data.title}
      </p>
      <p class="-mt-0.5 text-[11px] leading-tight line-clamp-2">
        {data.artist}
      </p>
    </div>
  </div>
</div>
