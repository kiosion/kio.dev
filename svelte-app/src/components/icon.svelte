<script lang="ts">
  import { t } from '$lib/i18n';
  import BaseIconWrapper from '$lib/icons/base-icon-wrapper.svelte';
  import {
    Alert,
    ArrowBarUp,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    At,
    BackBurger,
    Check,
    Copy,
    Downasaur,
    ExternalLink,
    ForwardBurger,
    GitBranch,
    GitCommit,
    Label,
    Link,
    MailArrowRight,
    MoonStars,
    Script,
    Sun
  } from '$lib/icons/index';
  import Logger from '$lib/logger';

  const icons = {
    alert: Alert,
    'arrow-bar-up': ArrowBarUp,
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'arrow-up': ArrowUp,
    at: At,
    'back-burger': BackBurger,
    check: Check,
    copy: Copy,
    downasaur: Downasaur,
    'external-link': ExternalLink,
    'forward-burger': ForwardBurger,
    'git-branch': GitBranch,
    'git-commit': GitCommit,
    label: Label,
    link: Link,
    'mail-arrow-right': MailArrowRight,
    'moon-stars': MoonStars,
    script: Script,
    sun: Sun
  } as const;

  type IconName = keyof typeof icons;

  const transformName = (name: string) =>
    name
      ?.replace(/([a-z])([A-Z])|([A-Z])([A-Z](?=[a-z]))|([a-zA-Z])(\d)/g, '$1$3$5-$2$4$6')
      ?.toLowerCase();

  const getIcon = (iconName: string) => {
    let name = transformName(iconName ?? '');
    if (!(name in icons)) {
      Logger.error(`Icon ${name} not found`);
      name = 'alert';
    }
    return icons[name as IconName];
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  export let name: IconName | (string & {}),
    inline = false,
    size = 20,
    active = false,
    interactive = false;

  $: InnerIconComponent = getIcon(name);
</script>

<div
  class={interactive
    ? active
      ? 'text-orange-light'
      : 'text-dark/90 dark:text-light/90'
    : undefined}
  class:hover:text-orange-light={interactive}
  class:focus-visible:text-orange-light={interactive}
  class:dark:hover:text-orange-light={interactive}
  class:dark:focus-visible:text-orange-light={interactive}
  class:inline
  style="width: {size}px; height: {size}px;"
>
  <BaseIconWrapper
    width={size}
    height={size}
    aria-label={name + $t(' icon')}
    {...$$restProps}
  >
    <svelte:component this={InnerIconComponent} />
  </BaseIconWrapper>
</div>
