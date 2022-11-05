<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import SwitchItem from '$components/toggles/switch-item.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import Features from '$stores/features';
  import type UIfx from 'uifx';
  import { onMount } from 'svelte';
  import { parseEmoji } from '$helpers/emoji';
  import PageHeading from '$components/headings/page-heading.svelte';
  import { Boundary } from '$lib/error-bound';

  let body: HTMLElement;
  let click: UIfx;

  onMount(() => {
    parseEmoji(body);
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });

  const onChange = (event: CustomEvent, target: string) => {
    Features.set(target, event?.detail?.state === true ? true : false);
    $CanUseSounds && click?.play();
  };

  navOptions.set({ down: '', up: '/' });
  pageHeading.set('Secret');

  export const hydrate = false;
  export const router = false;

  $: CanUseReduceMotion = Features.can('use reduce motion feature');
  $: CanUseSounds = Features.can('use sounds feature');
  $: CanUseCustomCursor = Features.can('use custom cursor feature');
  $: CanUseComicSans = Features.can('use comic sans feature');
</script>

<svelte:head>
  <title>kio.dev | secret stuff</title>
</svelte:head>

<div data-test-route="index" class="w-full" bind:this={body}>
  <PageHeading
    heading="Secret Features"
    text="This is where I keep all my secret options and WIP features :)"
  />
  <Boundary onError={console.error}>
    <ContentWrapper>
      <SwitchItem
        action={onChange}
        target={'reduce-motion'}
        state={$CanUseReduceMotion}
        label="Reduce motion"
      />
      <SwitchItem
        action={onChange}
        target={'custom-cursor'}
        state={$CanUseCustomCursor}
        label="Custom cursor"
      />
      <SwitchItem
        action={onChange}
        target={'sounds'}
        state={$CanUseSounds}
        label="UI interaction sounds"
      />
      <SwitchItem
        action={onChange}
        target={'comic-sans'}
        state={$CanUseComicSans}
        label="Comic Sans 😃"
      />
    </ContentWrapper>
  </Boundary>
</div>
