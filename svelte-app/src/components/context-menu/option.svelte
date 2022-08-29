<script lang="ts">
  import { getContext, createEventDispatcher, SvelteComponent } from 'svelte';
  import { key } from './menu';

  export let disabled = false;
  export let icon: SvelteComponent | string;
  export let text = '';
  export let index = 0;

  const dispatch = createEventDispatcher();

  const { dispatchClick } = getContext(key);

  const handleClick = () => {
    if (disabled) {
      return;
    }
    dispatch('click');
    dispatchClick();
  };
</script>

<div
  class="w-full max-w-[460px] flex justify-start items-center gap-4 px-4 py-2  dark:text-slate-100 {disabled
    ? 'bg-gray-400/50 cursor-not-allowed'
    : 'hover:bg-slate-400/50 cursor-pointer'} transition-colors duration-75"
  data-test-option-index={index}
  role="button"
  tabindex="0"
  on:click={handleClick}
>
  {#if text !== ''}
    {#if icon}
      <svelte:component this={icon} width="20" class="mb-[2px]" />
    {/if}
    <p
      class="font-sans text-base break-all line-clamp-1 overflow-ellipsis w-fit max-w-full mr-2"
    >
      {text}
    </p>
  {:else}
    <slot />
  {/if}
</div>
