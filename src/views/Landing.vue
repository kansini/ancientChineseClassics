<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getBooksData } from '@/api/getBooksData'
import type { IContents } from '@/interface'
import AppDownload from '@/components/AppDownload.vue'

const $router = useRouter()
const bookNames = ref<string[]>([])

getBooksData('contents').then((res) => {
  bookNames.value = res.data.map((item: IContents) => {
    return item.title
  })
})
</script>
<template>
  <loading @enter="$router.push('home')" />
  <div class="landing-app-download"><AppDownload compact inverse /></div>
  <div class="img-preload">
    <template v-for="name in bookNames">
      <img :src="`./assets/bookTitle/title_${name}.svg`" alt="" />
      <img :src="`./assets/bookTitle/illus_${name}.svg`" alt="" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.img-preload {
  display: none;
}

.landing-app-download {
  position: fixed;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}
</style>
