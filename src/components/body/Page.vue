<template>
  <!-- <div class="container text-light mt-4 sm:mt-8"> -->
  <div class="container flex flex-1 flex-col mt-4 sm:mt-8">
    <Index 
      header1="placeholder" 
      label1="title"
      content1="Quick demo site based on the Vue hello-world project. Currently working on new pages and components :)"
      header2="placeholder 2"
      label2="main section"
      content2="Electric boogaloo."
    />
  </div>
</template>

<script>
import Index from './Index.vue'

export default {
  name: 'Page',
  props: {},
  components: {
    Index,
  }
}
</script>
