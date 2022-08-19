<script lang="ts">
  import ListItemWrapper from '../list-item-wrapper.svelte';

  export let mousePos = [0, 0];
  let hovered = false;
  // Temp
  export let title: string;
  export let desc: string;
</script>

<ListItemWrapper {hovered} {mousePos} wrapperClass="w-full min-w-[50%]">
  <div class="w-full flex p-4 bg-slate-200 dark:bg-slate-900 rounded-md">
    <div class="flex flex-col">
      <h1 class="font-code font-bold text-xl">{title}</h1>
      <p class="overflow-hidden line-clamp-2 font-sans text-base my-2 mr-2">
        {desc}
      </p>
      <a
        href="/"
        class="w-fit font-sans text-base hover:underline mt-auto"
        on:mouseenter={() => (hovered = true)}
        on:mouseleave={() => (hovered = false)}>Read more</a
      >
    </div>
  </div>
</ListItemWrapper>
