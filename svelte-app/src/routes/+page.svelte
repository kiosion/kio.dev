<script lang="ts">
    import ArrowButton from '$components/controls/arrow-button.svelte';
    import EmptyContent from '$components/empty-content.svelte';
    import HeadedBlock from '$components/headings/headed-block.svelte';
    import BaseContainer from '$components/layouts/base-container.svelte';
    import ListItem from '$components/lists/list-item.svelte';
    import PortableText from '$components/portable-text/portable-text.svelte';
    import { pageTitle } from '$lib/navigation';
  
    export let data;
  
    // $: description = $t('pages.about.description');
</script>
  
<svelte:head>
  <title>{$pageTitle}</title>
  <meta itemprop="name" content={$pageTitle} />
  <!-- <meta itemprop="description" content={description} /> -->
  <meta name="robots" content="index, follow" />
  <!-- <meta name="description" content={description} /> -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={$pageTitle} />
  <!-- <meta property="og:description" content={description} /> -->
  <meta property="twitter:title" content={$pageTitle} />
  <!-- <meta property="twitter:description" content={description} /> -->
</svelte:head>

{#snippet postListItem(post: typeof data.posts[number])}
  <a class="block group py-4" href={`/thoughts/${post.slug.current}`}>
    <div class="flex items-baseline justify-between gap-4">
      <h3 class="font-semibold group-hover:underline group-hover:underline-offset-4 decoration-orange-light dark:decoration-orange-dark decoration-2">
        {post.title}
      </h3>
      <time class="text-sm text-neutral-700 whitespace-nowrap">
        {new Date(post.date!).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}
      </time>
    </div>
    {#if post.desc}
      <p class="mt-1 text-sm text-neutral-800">{post.desc}</p>
    {/if}
  </a>
{/snippet}

<div class="flex flex-col flex-grow gap-20 h-full min-w-full">
  <section class="flex flex-row flex-wrap items-start justify-between w-full mt-10 gap-y-12">
    <div class="flex flex-col gap-8 mr-auto">
      <div class="flex flex-col gap-2 text-5xl font-display tracking-wide max-w-2xl">
        <p>My name is Maxim</p>
        <p>Senior Software Engineer based in New York, NY.</p>
      </div>
      <p class="text-lg max-w-prose">
        I'm a systems-focused engineer working at the intersection of security, infrastructure, and complex application design.
        I've worked everywhere from early-stage startups to large, distributed platforms, delivering secure, reliable systems that scale.
      </p>
    </div>
    <div class="flex flex-col text-md gap-14 text-right opacity-70 ml-auto">
      <div class="flex flex-col gap-2">
        <p>Infrastructure Reliability</p>
        <p>Identity & Access</p>
        <p>Performance Engineering</p>
      </div>
      <p>Available for select consulting<br> from July 2025.</p>
    </div>
  </section>

  <div class="flex-1 min-h-0"></div>

  <section class="flex flex-col gap-2">
    <div class="text-base tracking-wide opacity-70">
      Recent posts
    </div>

    {#if !data.posts.length}
      <p class="text-md opacity-70">No posts yet.</p>
    {:else}
      <ul class="divide-y divide-dark dark:divide-light border-t border-b border-dark dark:border-light mb-4">
        {#each data.posts as post}
          <li>{@render postListItem(post)}</li>
        {/each}
      </ul>
    {/if}

    <div class="flex flex-row items-center gap-2 text-sm">
      <a href="/thoughts" class="underline underline-offset-4 hover:no-underline">More</a>
      <span class="opacity-70 select-none">/</span>
      <a href="/thoughts/+" class="underline underline-offset-4 hover:no-underline">Topics</a>
    </div>
  </section>
</div>

  <!-- <div class="flex flex-col gap-y-5">
    <BaseContainer>
      {#if data.config?.about}
        {#each data.config.about as aboutSection, idx}
          {#if aboutSection.content}
            <HeadedBlock heading={aboutSection.title} first={idx === 0}>
              <PortableText text={aboutSection.content} class="-mt-2" bodySize="base" />
            </HeadedBlock>
  
            {#if idx < data.config.about.length - 1}
              <span
                class="-my-1 block w-full min-w-0 flex-1 border-b border-dashed border-neutral-200 transition-colors dark:border-neutral-400"
              ></span>
            {/if}
          {/if}
        {/each}
      {:else}
        <EmptyContent />
      {/if}
    </BaseContainer>
  
    <BaseContainer>
      <HeadedBlock heading="Recent thoughts" let:id constrainWidth={false} first>
        {#if data.posts.length}
          <div
            class="flex flex-row flex-wrap gap-5 px-5 pb-1"
            role="group"
            aria-labelledby="{id}-heading"
          >
            {#each data.posts as post}
              <ListItem document={post} />
            {/each}
          </div>
        {:else}
          <div class="px-8">
            <p class="font-code p-4">No content</p>
          </div>
        {/if}
      </HeadedBlock>
    </BaseContainer>
  </div> -->
  