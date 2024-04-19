<script lang="ts">
  import Icon from '$components/icon.svelte';

  export let dir: 'left' | 'right',
    onClick: () => void,
    disabled = false;
</script>

<button
  class="focus-outline-sm mt-4 flex flex-grow items-center rounded-md text-accent-light hover:text-dark focus-visible:text-dark disabled:cursor-not-allowed disabled:text-dark/60 dark:text-accent-dark dark:hover:text-light dark:focus-visible:text-light dark:disabled:text-light/60"
  class:justify-end={dir === 'right'}
  class:justify-start={dir === 'left'}
  on:click={onClick}
  on:keydown={(e) => {
    if (e.key === 'Enter') {
      onClick();
    }
  }}
  {disabled}
>
  <Icon name={dir === 'left' ? 'ArrowLeft' : 'ArrowRight'} size={22}></Icon>
</button>
