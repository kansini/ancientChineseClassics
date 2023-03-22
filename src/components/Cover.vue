<script lang="ts" setup>
import {reactive, ref} from "vue";
import {useBookName} from "@/stores/bookName"

const bookName = useBookName().bookName
const baseUrl = ref('../src/assets/img/bookTitle/title_')
const bookTitle = ref<string>(`${baseUrl.value}${bookName}.svg`)

const motionOption = reactive({
  initial: {
    opacity: 0,
    scale: 10,
    filter: 'blur(10px)',
  },
  enter: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 400
    }
  }
})
</script>
<template>
  <div class="cover">
    <div class="title"
         :style="{'background-image':`url(${bookTitle})`}"
         v-motion
         :initial="motionOption.initial"
         :enter="motionOption.enter"
    ></div>
    <div
        class="illustration"
        v-motion
        :initial="motionOption.initial"
        :enter="motionOption.enter"
        :delay="400"
    ></div>
  </div>
</template>


<style lang="scss" scoped>
.cover {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .title {
    width: 64px;
    height: 280px;
    background: no-repeat center;
    background-size: 100%;
  }

  .illustration {
    width: 156px;
    height: 280px;
    background: url("../assets/img/illustration-cover.svg") no-repeat center right;
    background-size: 100%;
  }
}
</style>