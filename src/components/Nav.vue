<template>
    <div class="container flex items-center py-4 mt-4 sm:mt-12">
        <div class="py-1"><img src="../assets/logo.png"/></div>
        <ul class="hidden sm:flex flex-1 justify-end items-center gap-12 text-light uppercase text-s">
            <li class="cursor-pointer">Home</li>
            <li class="cursor-pointer">Projects</li>
            <li class="cursor-pointer">About</li>
            <li class="cursor-pointer">Contact</li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'Nav',
  props: {}
}
</script>