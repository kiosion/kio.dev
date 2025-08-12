<script lang="ts">
    import { page } from "$app/state";
    import type { GetConfigQueryResult } from "$types/sanity";
    import { crossfade, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
  
    const { config }: { config: NonNullable<GetConfigQueryResult> } = $props();

    const url = $derived(page?.url?.pathname);

    const navLinks = [
      {
        name: 'Home',
        url: '/',
      },
      {
        name: 'About',
        url: '/about',
      },
      {
        name: 'Thoughts',
        url: '/thoughts',
      },
      {
        name: 'Get in touch',
        url: '/contact',
      },
    ];

    const [send, receive] = crossfade({
      easing: cubicOut,
      duration: 500,
      fallback(node, params) {
        return fade(node, { duration: 250, easing: params.easing });
      },
    });
</script>

{#snippet navLink(href: string, text: string)}
  <a
    href={href}
    class="underline-offset-4 opacity-70 hover:opacity-100 hover:underline transition-opacity decoration-orange-light dark:decoration-orange-dark decoration-2"
    data-sveltekit-preload-code
    data-sveltekit-preload-data
  >{text}</a>
{/snippet}

<header class="border-b border-dark dark:border-light">
  <div class="relative isolate mx-auto px-8 py-6 flex items-center justify-between gap-6 w-full">
    <div class="flex flex-row items-center gap-x-4">
      <div class="flex flex-row items-center gap-x-2 select-none">
        <p class="text-md tracking-wide opacity-70">kio.dev</p>
        <span class="text-md opacity-70">/</span>
      </div>
      <div class="relative inline-grid grid-cols-[max-content]">
        <span class="invisible block text-md tracking-wide">{navLinks.reduce((max, l) => l.name.length > max.length ? l.name : max, '')}</span>
        {#each navLinks as link}
          {#if link.url === url}
            <p
              class="absolute inset-0 text-md tracking-wide underline-offset-4 underline decoration-orange-light dark:decoration-orange-dark decoration-2"
              in:receive={{ key: link.url }}
              out:send={{ key: link.url }}
            >{link.name}</p>
          {/if}
        {/each}
      </div>
    </div>
  
    <nav class="flex flex-row items-center justify-between text-md tracking-wide">
      <div class="grid grid-cols-[max-content_max-content_max-content_max-content] gap-10 w-full">
        {#each navLinks as link, i}
          <div class="relative">
            <span class="invisible block">{link.name}</span>
            {#if link.url !== url}
              <div
                class="absolute left-0 top-0"
                in:receive={{ key: link.url }}
                out:send={{ key: link.url }}
              >
                {@render navLink(link.url, link.name)}
              </div>
            {:else}
              <div class="absolute left-0 top-0 select-none opacity-40"
                in:receive={{ key: link.url }}
                out:send={{ key: link.url }}
              >
                {link.name}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </nav>
  </div>
</header>
