<script lang="ts">
  import Icon from '$components/icon.svelte';

  export let dir: 'left' | 'right',
    onClick: () => void,
    disabled = false;
</script>

<button
  on:click={onClick}
  on:keydown={(e) => {
    if (e.key === 'Enter') {
      onClick();
    }
  }}
  {disabled}
  class={dir === 'right' ? 'justify-end' : 'justify-start'}
>
  <Icon name={dir === 'left' ? 'ArrowLeft' : 'ArrowRight'} size={22} />
</button>

<style lang="scss">
  @import '@styles/mixins';

  button {
    @apply mt-4 flex flex-grow items-center rounded-md text-accent-light;

    @include focused {
      @apply text-dark;

      @include dark {
        @apply text-light;
      }
    }

    &:disabled {
      @apply cursor-not-allowed text-dark/60;

      @include dark {
        @apply text-light/60;
      }
    }

    @include focus-state(sm);
  }
</style>
