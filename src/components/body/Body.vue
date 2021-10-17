<template>
    <!-- Content block -->
    <div class="flex flex-row gap-4 sm:gap-8 items-end mt-4 sm:mt-8">
        <span class="w-48 flex justify-end items-center font-FiraCode text-sm">> {{ label1 }}</span>
        <span class="flex-1 justify-start items-center"><Header v-bind:msg="header1"/></span>
    </div>
    <div class="flex flex-row gap-4 sm:gap-8 items-end mt-4 sm:mt-8">
        <span class="ml-52 sm:ml-56 flex-1 justify-start items-center font-FiraCode text-base">{{ content1 }}</span>
    </div>
    <!-- Content block -->
    <div class="flex flex-row gap-4 sm:gap-8 items-end mt-4 sm:mt-8">
        <span class="w-48 flex justify-end items-center font-FiraCode text-sm">> {{ label2 }}</span>
        <span class="flex-1 justify-start items-center"><Header v-bind:msg="header2"/></span>
    </div>
    <div class="flex flex-row gap-4 sm:gap-8 items-end mt-4 sm:mt-8">
        <span class="ml-52 sm:ml-56 flex-1 justify-start items-center font-FiraCode text-base">{{ content2 }}</span>
    </div>

</template>

<script>
import Header from './Header.vue'

export default {
  name: 'Body',
  props: {
      header1: String,
      label1: String,
      content1: String,
      header2: String,
      label2: String,
      content2: String,
  },
  components: {
    Header,
  }
}
</script>