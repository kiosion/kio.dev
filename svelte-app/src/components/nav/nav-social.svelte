<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';
  import Icon from '@iconify/svelte';
  import SFX from '$lib/sfx';
  import { goto } from '$app/navigation';

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
  <Tooltip
    text={`${social.name
      ?.substring(0, 1)
      ?.toUpperCase()}${social.name?.substring(1)}`}
    position="right"
    delay={250}
    fixed
  >
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="flex justify-center p-2 transition-colors duration-150 cursor-pointer align-center hover:text-violet-400 dark:hover:text-violet-300 rounded-sm focusOutline-sm"
      role="menuitem"
      aria-label={social.name}
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
