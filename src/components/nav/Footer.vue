<template>
    <div class="container flex flex-col absolute bottom-0 items-start py-4 px-8 mt-4 sm:mt-8">
        <!-- <NavLogo path="logo.png"/> -->
        <ul class="hidden sm:flex flex-1 justify-start items-center gap-12 text-light uppercase text-sm">
            <li class="cursor-default"><a v-bind:href="link" v-bind:target="target " class="text-light">&copy; 2021 Kiosion</a></li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'Footer',
  components: {
  },
  props: {}
}
</script>