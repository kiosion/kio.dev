<template>
    <!-- <div class="container flex items-center py-4 mt-4 sm:mt-8"> -->
    <div class="container flex flex-col items-end py-4 px-8 mt-4 sm:mt-8">
        <!-- <NavLogo path="logo.png"/> -->
        <ul class="hidden sm:flex flex-1 justify-end items-center gap-12 text-light uppercase text-s">
            <NavElement link="#" target="" msg="Home"/>
            <NavElement link="#" target="" msg="Projects"/>
            <NavElement link="#" target="" msg="About"/>
            <NavElement link="#" target="" msg="Contact"/>
        </ul>
    </div>
</template>

<script>
// import NavLogo from './NavLogo.vue'
import NavElement from './NavElement.vue'

export default {
  name: 'Nav',
  components: {
    //   NavLogo,
      NavElement
  },
  props: {}
}
</script>