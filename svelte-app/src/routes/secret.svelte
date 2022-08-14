<script lang="ts">
  import PageHeading from '@/components/headings/page-heading.svelte';
  import ContentWrapper from '@/components/content-wrapper.svelte';
  import SwitchItem from '@/components/toggles/switch-item.svelte';
  import { svgBackground, highlightEffects } from '@/stores/features';
  import { onMount } from 'svelte';
  import twemoji from 'twemoji';

  let body: HTMLElement;

  onMount(() => {
    twemoji.parse(body);
    body.querySelectorAll('img.emoji').forEach((emoji: Element) => {
      if (!emoji?.style) {
        return;
      }
      emoji.style.display = 'inline-block';
      emoji.style.width = '1.1em';
      emoji.style.height = '1.1em';
      emoji.style.marginBottom = '0.1em';
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (event: CustomEvent, target: any) => {
    target.set(event?.detail?.state === true ? 'on' : 'off');
  };
</script>

<svelte:head>
  <title>kio.dev | secret stuff</title>
</svelte:head>

<div data-test-route="index" class="w-full" bind:this={body}>
  <PageHeading
    title="secret features"
    subtitle="You found the secret features page!"
  />
  <div class="mt-14">
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
        label="Click / interaction sounds"
        disabled={true}
      />
      <SwitchItem action={onChange} label="Comic Sans 😃" disabled={true} />
    </ContentWrapper>
  </div>
</div>

<style lang="scss">
  .emoji {
    display: inline-block;
  }
</style>
