<script lang="ts">
  import Icon from '@iconify/svelte';
  import { theme } from '@/stores/theme';

  export let content: string;
  export let showClipboard = false;

  let hovered = false;
  let copied = false;

  const copy = () => {
    content && navigator.clipboard.writeText(content);
    clicked();
  };

  const clicked = async () => {
    if (!copied && hovered) {
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 1200);
    }
  };
</script>

<div
  class="relative my-6 w-full text-lg md:text-md"
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
>
  {#if showClipboard}
    <button
      class="{hovered
        ? 'opacity-100'
        : 'opacity-0'} cursor-pointer m-2 p-2 absolute right-0 top-0 transition-opacity duration-150 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      on:click={() => copy()}
    >
      {#if copied}
        <Icon icon="fa-solid:clipboard-check" />
      {:else}
        <Icon icon="fa-solid:clipboard" />
      {/if}
    </button>
  {/if}
  <div
    class="p-4 bg-slate-200 dark:bg-slate-900 is-{$theme} transition-all duration-150"
  >
    <pre class="font-code w-fit">{content}</pre>
  </div>
</div>

<style lang="scss">
  div {
    border-radius: 6px;
    max-width: 100%;
    overflow: auto;

    &.is {
      &-light {
        box-shadow: 0 0 16px -2px rgba(0, 0, 0, 0.08);
      }
      &-dark {
        box-shadow: 0 0 16px -2px rgba(170, 170, 170, 0.08);
      }
    }
  }
  pre {
    font-size: 0.9em;
    line-height: 1.2em;
    max-width: 100%;
    overflow-wrap: break-word;
  }
</style>
