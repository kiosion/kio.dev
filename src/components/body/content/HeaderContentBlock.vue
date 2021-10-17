<template>
    <div class="flex flex-row gap-4 sm:gap-8 mt-4 sm:mt-8">
        <span class="w-48 flex justify-end items-center self-end">>&nbsp;<Label v-bind:msg="label"/></span>
        <span class="flex-1 justify-start items-center"><Header v-bind:msg="header"/></span>
    </div>
    <div class="flex flex-row gap-4 sm:gap-8 items-end mt-4 sm:mt-8">
        <span class="ml-52 sm:ml-56 flex-1 justify-start items-center"><Paragraph v-bind:msg="content"/></span>
    </div>
</template>

<script>
import Label from '../text/Label.vue'
import Header from '../text/Header.vue'
import Paragraph from '../text/Paragraph.vue'

export default {
  name: 'HeaderContentBlock',
  props: {
      label: String,
      header: String,
      content: String
  },
  components: {
      Label,
      Header,
      Paragraph
  }
}
</script>