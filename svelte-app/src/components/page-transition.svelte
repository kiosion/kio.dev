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

    const toRoute = path.startsWith('/')
      ? path
        .slice(1)
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/')
      : path
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/');
    const fromRoute = prev.startsWith('/')
      ? prev
        .slice(1)
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/')
      : prev
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/');

    const dirs = [
      fromRoute === '' ? 'index' : fromRoute,
      toRoute === '' ? 'index' : toRoute
    ].join('-');

    // TODO: Make this not-terrible, extract to a map or something
    if (
      [
        'blog-about',
        'blog-blog/*',
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
        'blog/*-blog',
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
    <div>
      <slot />
    </div>
  {:else}
    <div
      class="h-full grid grid-cols-1 grid-rows-1"
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

<style lang="scss">
  div > * {
    grid-column: 1;
    grid-row: 1;
  }
</style>
