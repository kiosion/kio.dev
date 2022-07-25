<script lang="ts">
  import Icon from '@iconify/svelte';
  import { theme } from '@/stores/theme';

  export let content: string;
  export let showClipboard = false;
</script>

<div
  class="relative mx-auto p-4 lg:p-6 my-6 md:my-4 bg-slate-200 dark:bg-slate-900 text-lg md:text-md w-fit is-{$theme}"
>
  {#if showClipboard}
    <Icon
      icon="fa-regular:copy"
      class="cursor-pointer text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 m-3 absolute right-0 top-0"
      on:click={() => navigator.clipboard.writeText(`${content}`)}
    />
  {/if}
  <pre class="font-code w-fit">{content}</pre>
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
