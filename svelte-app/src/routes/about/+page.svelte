<script lang="ts">
  import ContentWrapper from '$components/content-wrapper.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import { about } from '$stores/about';
  import ErrorText from '$components/error-text.svelte';
  import { navOptions, pageHeading } from '$stores/nav';
  import { urlFor, getCrop, type ImageCrop } from '$lib/helpers/image';
  import Divider from '$components/divider.svelte';
  import { fade } from 'svelte/transition';

  navOptions.set({ down: '', up: '/work' });
  pageHeading.set('About');

  let pfpCrop: ImageCrop;

  $: pfpCrop = getCrop($about?.data?.image);
</script>

<svelte:head>
  <title>kio.dev | about</title>
  <meta name="description" content="A bit about me & my work" />
  <meta name="keywords" content="About, kio.dev, kio, kiosion" />
  <meta name="author" content="Kio" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kio.dev/about" />
  <meta property="og:title" content="kio.dev | about" />
  <meta property="og:description" content="A bit about me & my work" />
  <meta property="twitter:url" content="https://kio.dev/about" />
  <meta property="twitter:title" content="kio.dev | about" />
  <meta property="twitter:description" content="A bit about me & my work" />
</svelte:head>

<div data-test-route="about">
  <ContentWrapper>
    <div
      class="w-full p-6 roundedCard-lg flex flex-col gap-6 justify-start items-start"
    >
      <div class="flex flex-row gap-6 justify-start items-center w-full h-fit">
        <div class="h-24 aspect-square">
          {#if $about?.data?.image?.asset}
            <img
              class="rounded-full aspect-square h-full border border-slate-400 select-none"
              src={urlFor($about.data.image.asset._ref)
                .size(150, 150)
                .rect(pfpCrop.left, pfpCrop.top, pfpCrop.width, pfpCrop.height)
                .fit('crop')
                .format('webp')
                .url()}
              alt="Profile pic"
              draggable="false"
              in:fade={{ duration: 150 }}
            />
          {/if}
        </div>
        <div
          class="flex-1 h-full w-full flex flex-col justify-start items-start"
        >
          <h3
            class="font-display font-bold text-2xl text-slate-800 dark:text-slate-100 transition-colors"
          >
            Maxim
          </h3>
          <h4
            class="font-mono font-bold text-xl text-slate-600 dark:text-slate-300 transition-colors"
          >
            @kiosion
          </h4>
        </div>
      </div>
      <div>
        <div class="flex-1 font-sans -my-4 p-2">
          {#if $about?.data?.bio}
            <PortableText text={$about.data.bio} />
          {:else}
            <ErrorText text="No data" classes="w-fit" />
          {/if}
        </div>
      </div>
    </div>
    {#if $about?.data?.body}
      <div>
        <Divider />
        <div class="mx-2">
          <PortableText text={$about.data.body} />
        </div>
      </div>
    {/if}
  </ContentWrapper>
</div>
