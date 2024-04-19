<script lang="ts">
  import { goto } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import { isLocalized, linkTo, t } from '$lib/i18n';

  import BaseLink from '$components/nav/base-link.svelte';

  export let link: {
      name: string;
      url: string;
    },
    navigatingIsActive = false;

  let isActive = false;

  const handleAction = (e: Event) => {
    e.preventDefault();
    if ($page?.url.pathname.slice($isLocalized ? 3 : 0) === link.url) {
      return;
    }
    goto($linkTo(link.url)).catch(() => undefined);
  };

  $: splitPath = $page?.url?.pathname?.split('/') || [];
  $: isActive = (() => {
    let urlIncludesLink =
      ($isLocalized ? $page?.url?.pathname?.slice(3) : $page?.url?.pathname) === link.url;

    if (navigatingIsActive) {
      urlIncludesLink ||= $navigating?.to?.url.pathname === link.url;
    }

    return (
      urlIncludesLink ||
      (splitPath?.length > 1 && splitPath.indexOf(link.url.slice(1)) > 0)
    );
  })();
</script>

<BaseLink text={$t(link.name)} href={link.url} active={isActive} on:click={handleAction}
></BaseLink>
