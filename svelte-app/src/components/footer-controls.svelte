<script lang="ts">
  import { navOptions } from '@/stores/menu';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import type UIfx from 'uifx';
  import { sounds } from '@/stores/features';

  let click: UIfx;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });
</script>

{#if $navOptions.down !== ''}
  <a
    href={$navOptions.down}
    class="hidden md:flex md:ml-40 lg:ml-60 fixed bottom-6 left-8  flex-row items-center select-none"
    on:click={() => $sounds === 'on' && click?.play()}
  >
    <Icon icon="akar-icons:arrow-down" />
    <p class="font-code text-base w-fit ml-4" tabindex="0">
      Continue ({$navOptions.down})
    </p>
  </a>
{/if}
