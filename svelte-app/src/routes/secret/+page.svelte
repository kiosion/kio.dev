<script lang="ts">
  import PageHeading from '$components/headings/page-heading.svelte';
  import ContentWrapper from '$components/content-wrapper.svelte';
  import SwitchItem from '$components/toggles/switch-item.svelte';
  import { navOptions, pageHeading } from '$stores/nav';
  import {
    svgBackground,
    highlightEffects,
    reduceMotion,
    sounds
  } from '$stores/features';
  import type UIfx from 'uifx';
  import { onMount } from 'svelte';
  import { parseEmoji } from '$lib/helpers/emoji';

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
</script>

<svelte:head>
  <title>kio.dev | secret stuff</title>
</svelte:head>

<div data-test-route="index" class="w-full" bind:this={body}>
  <div class="mt-12">
    <ContentWrapper>
      <SwitchItem
        action={onChange}
        target={svgBackground}
        state={$svgBackground === 'on'}
        label="Animated waves background"
      />
      <SwitchItem
        action={onChange}
        target={highlightEffects}
        state={$highlightEffects === 'on'}
        label="Container highlight effects"
      />
      <SwitchItem
        action={onChange}
        target={reduceMotion}
        state={$reduceMotion === 'on'}
        label="Reduce motion"
      />
      <SwitchItem
        action={onChange}
        target={sounds}
        state={$sounds === 'on'}
        label="UI interaction sounds"
      />
      <SwitchItem action={onChange} label="Comic Sans 😃" disabled={true} />
    </ContentWrapper>
  </div>
</div>
