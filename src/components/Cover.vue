<script lang="ts" setup>
import {reactive, ref} from "vue";
import {useBookName} from "@/stores/bookName"

const bookName = useBookName().bookName
const baseUrl = ref('./assets/bookTitle/')
const bookTitle = ref<string>(`${baseUrl.value}title_${bookName}.svg`)
const bookIllus = ref<string>(`${baseUrl.value}illus_${bookName}.svg`)
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
      duration: 200
    }
  }
})
</script>
<template>
  <div class="cover">
    <div class="title"
         v-motion
         :initial="motionOption.initial"
         :enter="motionOption.enter"
    >
      <img :src="bookTitle">
    </div>
    <div
        class="illustration"
        v-motion
        :initial="motionOption.initial"
        :enter="motionOption.enter"
        :delay="200"
    >
      <img :src="bookIllus">
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