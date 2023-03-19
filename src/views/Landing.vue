<template>
  <loading @enter="$router.push('home')"/>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
const $router = useRouter()
</script>

<style scoped>

</style>