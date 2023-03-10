<script lang="ts">
  import SwitchItem from '$components/controls/switch-item.svelte';
  import { navOptions, pageHeading } from '$stores/navigation';
  import Features from '$stores/features';
  import PageHeading from '$components/headings/page-heading.svelte';
  import SFX from '$lib/sfx';
  import { linkTo, t } from '$i18n';
  import { page } from '$app/stores';
  import Button from '$components/controls/button.svelte';

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
  $: CanUseCustomCursor = Features.can('use custom cursor');
  $: CanUseComicSans = Features.can('use comic sans');
  $: CanSeeComments = Features.can('see comments');
  $: CanUseNewNav = Features.can('use new nav');
</script>

<svelte:head>
  <title>kio.dev | secret stuff</title>
</svelte:head>

<div data-test-route="index" class="w-full">
  <PageHeading
    heading={$t('Features')}
    text={$t('Secret & work-in-progress features')}
    icon="AbTesting"
  />
  <div class="mt-6">
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
      target={'new-nav'}
      state={$CanUseNewNav}
      label="New navigation"
    />
  </div>
  <div class="mt-6">
    <h3 class="text-xl font-bold">Other</h3>
    <div class="mt-4 flex flex-col items-start justify-start">
      <Button
        href={$linkTo(`/auth/login?redirect=${$linkTo($page.url.pathname)}`)}
      >
        {$t('Log in with {provider}', { provider: 'GitHub' })}
      </Button>
    </div>
  </div>
</div>
