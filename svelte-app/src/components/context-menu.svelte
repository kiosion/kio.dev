<script lang="ts">
  import { getContext } from 'svelte';

  import { setState, state } from '$lib/helpers/menu';

  import Divider from './context-menu/divider.svelte';
  import Menu from './context-menu/menu.svelte';
  import Option from './context-menu/option.svelte';

  const pageContainer = (getContext('getPageContainer') as () => HTMLDivElement)();
</script>

<Menu
  {...$state.pos}
  {pageContainer}
  on:click={() => setState()}
  on:clickoutside={() => setState()}
>
  {#if $state.open}
    {#each $state.opts as option, index}
      {#if option.text && option.icon}
        <Option
          icon={option.icon}
          text={option.text}
          disabled={option.disabled}
          {index}
          on:click={option.action ? option.action : () => undefined}
        />
      {:else}
        <Divider />
      {/if}
    {/each}
  {/if}
</Menu>
