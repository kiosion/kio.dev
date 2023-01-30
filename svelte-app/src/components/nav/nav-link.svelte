<script lang="ts">
  import LinkIndicator from '$components/nav/link-indicator.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import { navOpen } from '$stores/navigation';
  import { page, navigating } from '$app/stores';
  import { t } from '$i18n';
  import { goto } from '$app/navigation';
  import SFX from '$lib/sfx';

  export let link: { name: string; url: string; active: boolean };

  $: isActive =
    [$page?.url?.pathname, $navigating?.to?.url.pathname].includes(link.url) ||
    link.active;
</script>

<Hoverable bind:hovered={link.active}>
  <div class="relative flex flex-row items-center justify-start">
    <a
      class="menuTarget focusOutline duration[40ms] z-[1] rounded-sm font-mono text-base font-normal uppercase transition-colors lg:text-lg"
      class:text-gray-900={isActive}
      aria-label={t(link.name)}
      href={link.url}
      role="menuitem"
      tabindex="0"
      data-sveltekit-preload-data
      data-sveltekit-preload-code
      on:click={() => {
        SFX.click.play();
        navOpen.set(false);
      }}
      on:keydown={(e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          SFX.click.play();
          navOpen.set(false);
          goto(link.url).catch(() => undefined);
        }
      }}
    >
      {t(link.name)}
    </a>
    <LinkIndicator {link} />
  </div>
</Hoverable>
