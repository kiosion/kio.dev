<template>
    <!-- Content block 1 -->
    <HeaderContentBlock
        v-bind:header="header1"
        v-bind:label="label1"
        v-bind:content="content1"
    />
    <!-- Content block 2 -->
    <HeaderContentBlock
        v-bind:header="header2"
        v-bind:label="label2"
        v-bind:content="content2"
    />
</template>

<script>
import HeaderContentBlock from './content/HeaderContentBlock.vue'

export default {
  name: 'Index',
  props: {
      header1: String,
      label1: String,
      content1: String,
      header2: String,
      label2: String,
      content2: String,
  },
  components: {
    HeaderContentBlock,
  }
}
</script>