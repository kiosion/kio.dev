<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import SwitchItem from '$components/toggles/switch-item.svelte';
  import { navOptions, pageHeading } from '$stores/nav';
  import {
    svgBackground,
    highlightEffects,
    reduceMotion,
    sounds,
    customCursor,
    comicSans
  } from '$stores/features';
  import type UIfx from 'uifx';
  import { onMount } from 'svelte';
  import { parseEmoji } from '$helpers/emoji';

  let body: HTMLElement;
  let click: UIfx;

  onMount(() => {
    parseEmoji(body);
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (event: CustomEvent, target: any) => {
    target.set(event?.detail?.state === true ? 'on' : 'off');
    $sounds === 'on' && click?.play();
  };

  navOptions.set({ down: '', up: '/' });
  pageHeading.set('Secret');

  export const hydrate = false;
  export const router = false;
</script>

<svelte:head>
  <title>kio.dev | secret stuff</title>
</svelte:head>

<div data-test-route="index" class="w-full" bind:this={body}>
  <div class="mt-12">
    <ContentWrapper>
      <SwitchItem
        action={onChange}
        target={reduceMotion}
        state={$reduceMotion === 'on'}
        label="Reduce motion"
      />
      <SwitchItem
        action={onChange}
        target={customCursor}
        state={$customCursor === 'on'}
        label="Custom cursor"
      />
      <SwitchItem
        action={onChange}
        target={highlightEffects}
        state={$highlightEffects === 'on'}
        label="Container highlight effects"
      />
      <SwitchItem
        action={onChange}
        target={sounds}
        state={$sounds === 'on'}
        label="UI interaction sounds"
      />
      <SwitchItem
        action={onChange}
        target={svgBackground}
        state={$svgBackground === 'on'}
        label="Animated waves background"
      />
      <SwitchItem
        action={onChange}
        target={comicSans}
        state={$comicSans === 'on'}
        label="Comic Sans 😃"
      />
    </ContentWrapper>
  </div>
</div>
