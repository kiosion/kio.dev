<script lang="ts">
  import { getContext, createEventDispatcher } from 'svelte';
  import Icon from '../icon.svelte';
  import { key } from './menu';
  import Hoverable from '$components/hoverable.svelte';

  export let disabled = false;
  export let icon: string;
  export let text = '';
  export let index = 0;

  const dispatch = createEventDispatcher();

  // @ts-expect-error getContext isn't typed
  const { dispatchClick } = getContext(key);

  const handleClick = () => {
    if (disabled) {
      return;
    }
    dispatch('click');
    dispatchClick();
  };
</script>

<Hoverable>
  <div
    class="flex w-full max-w-[460px] items-center justify-start gap-4 px-4 py-2 {disabled
      ? 'cursor-not-allowed bg-stone-400/50 text-stone-800 dark:bg-stone-500/50'
      : 'cursor-pointer hover:bg-stone-300/50 dark:hover:bg-stone-500/50'}"
    data-test-option-index={index}
    role="button"
    tabindex="0"
    on:click={handleClick}
    on:keydown={(e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        handleClick();
      }
    }}
  >
    {#if text !== ''}
      <div class="mb-[2px] w-[20px]">
        <Icon {icon} />
      </div>
      <p
        class="mr-2 w-fit max-w-full overflow-ellipsis break-all font-sans text-base line-clamp-1"
      >
        {text}
      </p>
    {:else}
      <slot />
    {/if}
  </div>
</Hoverable>
