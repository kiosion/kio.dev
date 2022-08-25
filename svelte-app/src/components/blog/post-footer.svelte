<script lang="ts">
  import Divider from '@/components/divider.svelte';

  export let tags: any[] | undefined;
</script>

<Divider />

<p class="font-code mb-4 text-lg">Tags</p>
<div class="mb-6">
  <div class="flex flex-row flex-wrap gap-2 justify-start items-start">
    {#if tags}
      {#each tags as tag}
        <a
          href="/tag/{tag?.slug?.current ? tag.slug.current : '#'}"
          class="w-fit text-base bg-slate-200 dark:bg-slate-900 rounded-md"
          tabindex="0"
        >
          <div class="w-fit py-1 px-2 rounded-md" tabindex="0">
            {tag?.title ? tag.title : 'Undefined'}
          </div>
        </a>
      {/each}
    {:else}
      <div
        class="w-fit text-base py-1 px-2 bg-slate-200 dark:bg-slate-900 rounded-md"
      >
        No tags
      </div>
    {/if}
  </div>
</div>
<p class="font-code mb-4 text-lg">More posts</p>
