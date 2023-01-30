<script lang="ts">
  import { state } from '$stores/menu';
  import { setState } from '$lib/helpers/menu';
  import Menu from './context-menu/menu.svelte';
  import Option from './context-menu/option.svelte';
  import Divider from './context-menu/divider.svelte';
  import { fly } from 'svelte/transition';
  import { getContext } from 'svelte';

  const pageContainer = (
    getContext('getPageContainer') as () => HTMLDivElement
  )();

  // export let pageContainer: HTMLDivElement;
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
        <div
          in:fly={{ duration: 100, delay: 10, y: -5 }}
          out:fly={{ duration: 100, y: -5 }}
        >
          <Option
            icon={option.icon}
            text={option.text}
            disabled={option.disabled}
            {index}
            on:click={option.action ? option.action : () => undefined}
          />
        </div>
      {:else}
        <Divider />
      {/if}
    {/each}
  {/if}
</Menu>
