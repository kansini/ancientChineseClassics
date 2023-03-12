<script setup lang="ts">
import Book from "../components/Book.vue"
import {reactive, ref} from "vue";

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
      duration: 800
    }
  }
})
const cursorSize = ref('')
</script>

<template>
  <custom-cursor :size="cursorSize"/>
  <div class="article"
       v-motion
       :initial="motionOption.initial"
       :enter="motionOption.enter"
  >
    <div class="title" @mouseenter="cursorSize = 'large'" @mouseleave="cursorSize = ''"></div>
    <div class="illustration" @mouseenter="cursorSize = 'large'" @mouseleave="cursorSize = ''"></div>
  </div>
  <Book name="天工开物"/>
</template>

<style lang="scss" scoped>
.article {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .title {
    width: 64px;
    height: 242px;
    background: url("../assets/img/title.svg") no-repeat center;
    background-size: cover;
  }

  .illustration {
    width: 156px;
    height: 242px;
    background: url("../assets/img/illustration-cover.svg") no-repeat center right;
    background-size: cover;
  }

}
</style>
