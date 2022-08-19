<script lang="ts">
  import { fly } from 'svelte/transition';
  import { reduceMotion } from '@/stores/features';

  export let url: URL;

  let prevPath: string;
  let navDir: 'forward' | 'backward' = 'forward';

  const onNav = (path: string) => {
    if (!path) {
      return;
    }

    let prev = prevPath ?? path;
    prevPath = path;

    const [toRoute] = path.startsWith('/')
      ? path.slice(1).split('/')
      : path.split('/');
    const [fromRoute] = prev.startsWith('/')
      ? prev.slice(1).split('/')
      : prev.split('/');
    const dirs = [
      fromRoute === '' ? 'index' : fromRoute,
      toRoute === '' ? 'index' : toRoute
    ].join('-');

    // TODO: Make this not-terrible, extract to a map or something
    if (
      [
        'blog-about',
        'blog-work',
        'index-about',
        'index-blog',
        'index-secret',
        'index-work',
        'work-about'
      ].includes(dirs)
    ) {
      navDir = 'forward';
    } else if (
      [
        'about-blog',
        'about-index',
        'about-work',
        'blog-index',
        'secret-index',
        'work-index',
        'work-blog'
      ].includes(dirs)
    ) {
      navDir = 'backward';
    } else {
      navDir = 'forward';
    }
  };

  $: url, onNav(url.pathname);
</script>

{#key url}
  {#if $reduceMotion === 'on'}
    <div class="m-0 p-0">
      <slot />
    </div>
  {:else}
    <div
      in:fly={{
        delay: 200,
        duration: 400,
        y: navDir === 'backward' ? -20 : 20
      }}
      out:fly={{ duration: 200, y: navDir === 'backward' ? 20 : -20 }}
    >
      <slot />
    </div>
  {/if}
{/key}
