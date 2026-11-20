<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppDownload from '@/components/AppDownload.vue'

const $router = useRouter()
const entering = ref(false)
const entryError = ref('')
const enterLibrary = async () => {
  if (entering.value) return
  entering.value = true
  entryError.value = ''
  try {
    const failure = await $router.push({ name: 'home' })
    if (failure) entryError.value = '暂时无法进入书架，请再次点击开卷。'
  } catch {
    entryError.value = '书架加载失败，请检查网络后再次点击开卷。'
  } finally {
    entering.value = false
  }
}
</script>
<template>
  <loading :entering="entering" :entry-error="entryError" @enter="enterLibrary" />
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
