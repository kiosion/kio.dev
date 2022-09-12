<script lang="ts">
  import { getContext, createEventDispatcher } from 'svelte';
  import SafeIcon from '../safe-icon.svelte';
  import { key } from './menu';

  export let disabled = false;
  export let icon: string;
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
    : 'hover:bg-slate-400/50 cursor-pointer'} transition-colors duration-75 hover-target"
  data-test-option-index={index}
  role="button"
  tabindex="0"
  on:click={handleClick}
>
  {#if text !== ''}
    <div class="w-[20px] mb-[2px]">
      <SafeIcon {icon} />
    </div>
    <p
      class="font-sans text-base break-all line-clamp-1 overflow-ellipsis w-fit max-w-full mr-2"
    >
      {text}
    </p>
  {:else}
    <slot />
  {/if}
</div>
