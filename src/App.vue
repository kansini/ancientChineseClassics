<script setup lang="ts">
import CustomCursor from "./components/kits/CustomCursor.vue"
</script>

<template>
  <custom-cursor/>
  <RouterView/>
</template>

<style lang="scss">
#app {
  background: url("./assets/img/main_bg.jpg") center;
  background-size: 100%;
}
</style>
