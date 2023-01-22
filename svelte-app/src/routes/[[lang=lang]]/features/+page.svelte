<script lang="ts">
  import SwitchItem from '$components/controls/switch-item.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import Features from '$stores/features';
  import { onMount } from 'svelte';
  import { parseEmoji } from '$helpers/emoji';
  import PageHeading from '$components/headings/page-heading.svelte';
  import SFX from '$lib/sfx';

  let body: HTMLElement;

  onMount(() => parseEmoji(body));

  const onChange = (event: CustomEvent, target: string) => {
    Features.set(target, event?.detail?.state === true ? true : false);
    SFX.click.play();
  };

  navOptions.set({ down: '', up: '/' });
  pageHeading.set('Secret');

  export const hydrate = false;
  export const router = false;

  $: CanUseReduceMotion = Features.can('reduce motion');
  $: CanUseSounds = Features.can('use sounds');
  $: CanUseCustomCursor = Features.can('use custom cursor');
  $: CanUseComicSans = Features.can('use comic sans');
  $: CanSeeComments = Features.can('see comments');
  $: CanUseTooltips = Features.can('see tooltips');
  $: CanSeeNewDesign = Features.can('see new design');
</script>

<svelte:head>
  <title>kio.dev | secret stuff</title>
</svelte:head>

<div data-test-route="index" class="w-full" bind:this={body}>
  <PageHeading
    heading="Secret Stuff"
    text="This is where I keep all my secret options and WIP features :)"
    icon="AbTesting"
  />
  <div class="mt-6">
    <h3 class="font-bold text-xl">Features</h3>
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
    <SwitchItem
      action={onChange}
      target={'comments'}
      state={$CanSeeComments}
      label="View Comments"
    />
    <SwitchItem
      action={onChange}
      target={'tooltips'}
      state={$CanUseTooltips}
      label="View Tooltips"
    />
    <SwitchItem
      action={onChange}
      target={'new-design'}
      state={$CanSeeNewDesign}
      label="New design"
    />
  </div>
  <div class="mt-6">
    <h3 class="font-bold text-xl">Other</h3>
    <div class="flex flex-col justify-start items-start mt-4">
      <button
        class="text-sm p-2 border-2 border-violet-300 hover:bg-violet-400 hover:border-violet-400 focus-visible:bg-violet-400 focus-visible:border-violet-400 focusOutline rounded-md hover:text-gray-800"
        on:click={() => {
          SFX.click.play();
        }}
      >
        Log in with GitHub
      </button>
    </div>
  </div>
</div>
