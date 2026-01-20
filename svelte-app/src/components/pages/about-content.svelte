<script lang="ts">
  import PortableText from '$components/portable-text/portable-text.svelte';
  import type { GetConfigQueryResult } from '$types/generated/sanity.types';

  let { config }: { config: NonNullable<GetConfigQueryResult> } = $props();
</script>

<div class="flex h-full min-w-full flex-grow flex-col gap-20">
  <div class="mt-8 flex h-full min-w-full flex-grow flex-col gap-12">
    {#if config.about}
      <section class="flex w-full flex-col gap-6">
        <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
          About me
        </h1>
        <PortableText text={config.about} />
      </section>
    {/if}

    {#if config.contact}
      <section class="flex w-full flex-col gap-6">
        <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
          Get in touch
        </h1>
        <PortableText text={config.contact} />
      </section>
    {/if}
  </div>
</div>
