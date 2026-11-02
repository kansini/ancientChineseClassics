<script lang="ts" setup>
import { computed, reactive } from 'vue'

const props = defineProps<{ name: string }>()
const baseUrl = `${import.meta.env.BASE_URL}assets/bookTitle/`
const bookTitle = computed(() => `${baseUrl}title_${props.name}.svg`)
const bookIllus = computed(() => `${baseUrl}illus_${props.name}.svg`)
const motionOption = reactive({
  initial: {
    opacity: 0,
    scale: 4,
    filter: 'blur(5px)',
  },
  enter: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 200,
    },
  },
})
</script>
<template>
  <div class="cover">
    <div class="title" v-motion :initial="motionOption.initial" :enter="motionOption.enter">
      <img :src="bookTitle" :alt="name" />
    </div>
    <div
      class="illustration"
      v-motion
      :initial="motionOption.initial"
      :enter="motionOption.enter"
      :delay="200"
    >
      <img :src="bookIllus" alt="" aria-hidden="true" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cover {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  overflow-x: hidden;

  .title {
    //width: 64px;
    height: 240px;

    img {
      height: 100%;
    }
  }

  .illustration {
    height: 248px;

    img {
      height: 100%;
    }
  }
}
</style>
