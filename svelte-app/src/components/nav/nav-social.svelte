<script lang="ts">
  import { goto } from '$app/navigation';
  import SFX from '$lib/sfx';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import Icon from '@iconify/svelte';

  interface SocialLink {
    attrs: {
      href: string;
      target: string | undefined;
      rel: string | undefined;
    };
    name: string;
    icon: string;
    iconSize: number;
    iconRotation: number;
  }

  export let social: SocialLink;
</script>

<Hoverable>
  <Tooltip text={social.name} delay={150} position="top" fixed>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="align-center focusOutline-sm flex cursor-pointer justify-center rounded-sm p-2 transition-colors duration-150 hover:text-violet-400 dark:hover:text-violet-300"
      role="menuitem"
      aria-label={social.name}
      tabindex="0"
      {...social.attrs}
      on:click={() => SFX.click.play()}
      on:keydown={(e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          SFX.click.play();
          goto(social.attrs.href).catch(() => undefined);
        }
      }}
    >
      <Icon
        icon={social.icon}
        rotate={`${social.iconRotation}deg`}
        width={social?.iconSize}
        height={social?.iconSize}
      />
    </a>
  </Tooltip>
</Hoverable>
