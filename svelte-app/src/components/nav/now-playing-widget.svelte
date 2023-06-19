<script lang="ts">
  import LastFM from '$lib/assets/last_fm-512.png';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import type { Data } from '$helpers/toru';

  export let data: Data;
</script>

<div class="nowPlaying--container">
  <span>
    <img
      class="cover"
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
        <img
          src={LastFM}
          alt="LastFM"
          class="focusOutline-sm logo"
          role="button"
          tabindex="0"
          on:click={() => {
            window.open('https://github.com/kiosion/toru', '_blank');
          }}
          on:keydown={(e) => {
            if (e.code === 'Enter' || e.code === 'Space') {
              window.open('https://github.com/kiosion/toru', '_blank');
            }
          }}
        />
      </Tooltip>
    </Hoverable>
  </span>
  <div>
    <p class="text-title ">
      {data.title}
    </p>
    <p class="text-sub ">
      {data.artist}
    </p>
  </div>
</div>

<style lang="scss">
  .nowPlaying--container {
    @apply mb-4 flex w-full flex-row items-center gap-3 border-b border-stone-400/50 pb-5;

    span {
      @apply relative h-fit w-fit flex-shrink-0;

      .cover {
        @apply aspect-square w-12 select-none rounded-sm;
      }
      .logo {
        @apply absolute h-5 w-5 select-none rounded-full bg-stone-100 transition-[background-color];
        padding: 3px;
        bottom: -5px;
        right: -5px;
      }
    }
    div {
      @apply flex flex-col gap-2 font-sans text-stone-700;

      .text {
        &-title {
          @apply line-clamp-2 font-bold leading-tight;
          font-size: 13px;
        }
        &-sub {
          @apply -mt-0.5 line-clamp-2 leading-tight;
          font-size: 11px;
        }
      }
    }
  }

  :global(.dark) {
    .nowPlaying--container {
      @apply border-stone-500/60;

      div {
        @apply text-stone-200;
      }

      .logo {
        @apply bg-stone-900;
      }
    }
  }
</style>
