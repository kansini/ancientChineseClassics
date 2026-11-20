<script lang="ts" setup>
import { useRouter } from 'vue-router'
import AppDownload from '@/components/AppDownload.vue'

const $router = useRouter()
</script>
<template>
  <loading @enter="$router.push('home')" />
  <div class="landing-app-download"><AppDownload compact inverse /></div>

</template>

<style lang="scss" scoped>
.landing-app-download {
  position: fixed;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}
</style>
