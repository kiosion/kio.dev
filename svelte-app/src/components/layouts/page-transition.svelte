<script lang="ts">
  import { circIn, circOut } from 'svelte/easing';
  import { get } from 'svelte/store';
  import { fly } from 'svelte/transition';

  import { beforeNavigate } from '$app/navigation';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { isLocalized } from '$lib/i18n';

  export let pathname: string | undefined;

  const duration = BASE_ANIMATION_DURATION * 1,
    dist_inc = 14;

  let dist = dist_inc;

  beforeNavigate((event) => {
    if (event.from?.url.pathname === event.to?.url.pathname) {
      return;
    }

    const from = get(isLocalized)
        ? event.from?.url.pathname.slice(3)
        : event.from?.url.pathname,
      to = get(isLocalized) ? event.to?.url.pathname.slice(3) : event.to?.url.pathname;

    dist = dist_inc * getDist(from || '/', to || '/');
  });

  // TODO: this is complete shit and needs to be refactored but i'm lazy and it works for now so like ehh
  const getDist = (from: string, to: string) => {
    switch (true) {
      case to === '/': {
        if (from === '/thoughts') {
          return -dist_inc;
        }
        if (from.startsWith('/thoughts/')) {
          return -(dist_inc * 2);
        }
        if (from === '/work') {
          return -(dist_inc * 2);
        }
        if (from.startsWith('/work/')) {
          return -(dist_inc * 3);
        }
        if (from === '/etc') {
          return -(dist_inc * 3);
        }
        break;
      }
      case to === '/thoughts': {
        if (from === '/') {
          return dist_inc;
        }
        if (from.startsWith('/thoughts/')) {
          return -dist_inc;
        }
        if (from === '/work') {
          return -dist_inc;
        }
        if (from.startsWith('/work/')) {
          return -(dist_inc * 2);
        }
        if (from === '/etc') {
          return -(dist_inc * 2);
        }
        break;
      }
      case to.startsWith('/thoughts/'): {
        if (from === '/') {
          return dist_inc * 2;
        }
        if (from.startsWith('/thoughts')) {
          return dist_inc;
        }
        if (from === '/work') {
          return -dist_inc;
        }
        if (from.startsWith('/work/')) {
          return -(dist_inc * 2);
        }
        if (from === '/etc') {
          return -(dist_inc * 2);
        }
        break;
      }
      case to === '/work': {
        if (from === '/') {
          return dist_inc * 2;
        }
        if (from === '/thoughts') {
          return dist_inc;
        }
        if (from.startsWith('/thoughts/')) {
          return dist_inc;
        }
        if (from.startsWith('/work')) {
          return dist_inc;
        }
        if (from === '/etc') {
          return -dist_inc;
        }
        break;
      }
      case to.startsWith('/work/'): {
        if (from === '/') {
          return dist_inc * 2;
        }
        if (from === '/thoughts') {
          return dist_inc * 2;
        }
        if (from.startsWith('/thoughts/')) {
          return dist_inc * 2;
        }
        if (from === '/work') {
          return dist_inc;
        }
        if (from.startsWith('/work/')) {
          return dist_inc;
        }
        if (from === '/etc') {
          return -dist_inc;
        }
        break;
      }
      case to === '/etc': {
        if (from === '/') {
          return dist_inc * 3;
        }
        if (from === '/thoughts') {
          return dist_inc * 2;
        }
        if (from.startsWith('/thoughts/')) {
          return dist_inc * 2;
        }
        if (from === '/work') {
          return dist_inc;
        }
        if (from.startsWith('/work/')) {
          return dist_inc;
        }
        if (from === '/etc') {
          return dist_inc;
        }
      }
    }

    return dist_inc;
  };
</script>

{#key pathname}
  <div
    {...$$restProps}
    in:fly={{ duration, delay: duration, easing: circOut, x: dist }}
    out:fly={{ duration, easing: circIn, x: -dist }}
  >
    <slot />
  </div>
{/key}
