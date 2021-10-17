<template>
    <li class="cursor-pointer"><a v-bind:href="link" v-bind:target="target " class="transition duration-100 ease-in-out text-light hover:text-blade drop-shadow-none hover:drop-shadow-xlg">{{ msg }}</a></li>
</template>

<script>
export default {
  name: 'NavElement',
  props: {
    msg: String,
    link: String,
    target: String
  }
}
</script>