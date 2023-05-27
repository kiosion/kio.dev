<script lang="ts">
  import { t } from '$i18n';
  import SFX from '$lib/sfx';
  import Features from '$stores/features';
  import { navOptions, pageHeading } from '$stores/navigation';

  import SwitchItem from '$components/controls/switch-item.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';

  const onChange = (event: CustomEvent, target: string) => {
    Features.set(target, event?.detail?.state === true ? true : false);
    SFX.click.play();
  };

  navOptions.set({ down: '', up: '/' });
  pageHeading.set($t('Features'));

  export const hydrate = false,
    router = false;

  $: CanUseReduceMotion = Features.can('reduce motion');
  $: CanUseSounds = Features.can('use sounds');
  $: CanUseComicSans = Features.can('use comic sans');
</script>

<svelte:head>
  <title>kio.dev | secret stuff</title>
</svelte:head>

<div data-test-route="features" class="mt-8 w-full pb-20">
  <IconHeader icon="AbTesting" text={$t('Features')} classNames="my-3" />
  <div class="mt-6">
    <SwitchItem
      action={onChange}
      target={'reduce-motion'}
      state={$CanUseReduceMotion}
      label="Reduce motion"
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
  </div>
</div>
