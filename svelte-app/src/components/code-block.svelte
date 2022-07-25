<script lang="typescript">
  import Icon from "@iconify/svelte";
  import { theme } from "@/stores/theme";

  export let content: string;
  export let showClipboard: boolean = false;
</script>
<div class="relative mx-auto p-4 lg:p-6 my-6 md:my-4 bg-slate-300 dark:bg-slate-900 text-lg md:text-md w-fit is-{$theme}">
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
        box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
      }
      &-dark {
        box-shadow: 0 0 14px rgba(150, 150, 150, 0.1);
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
