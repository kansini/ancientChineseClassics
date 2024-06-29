<script setup lang="ts">
import { ref, reactive } from "vue";
import BookShelf from "@/components/BookShelf.vue";
import CustomCursor from "@/components/kits/CustomCursor.vue";

// const motionOption = reactive({
//   initial: {
//     opacity: 0,
//     y: 240,
//     scale: .5
//   },
//   enter: {
//     opacity: 1,
//     y: 0,
//     scale: 1
//   }
// })
const titleMotionOption = reactive({
  initial: {
    opacity: 0,
    scale: 10,
    // y: -200
  },
  enter: {
    opacity: 1,
    scale: 0.8,
    y: 0
  },
  leave: {
    opacity: 0,
    scale: 10,
    // y: -200
  }
})

const cursorSize = ref('')
const cursorColor = ref('')
const cursorText = ref('中国典籍·The Ancient Chinese Classics·')
const handleMouseEnter = (text: string) => {
  cursorSize.value = "large"
  cursorText.value = `·中国典籍·${text}·中国典籍·${text}`
}
</script>

<template>
  <custom-cursor
      :color="cursorColor"
      :size="cursorSize"
      :text="cursorText"
  />
  <div class="home">
    <div
        class="title"
        v-motion
        :initial="titleMotionOption.initial"
        :enter="titleMotionOption.enter"
        :delay="500"
    >

    </div>
    <book-shelf
        @mouseenter="handleMouseEnter"
        @mouseleave="cursorSize = ''"
    />
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: hidden;

  .title {
    width: 344px;
    height: 72px;
    margin-bottom: 80px;
    background: url("../assets/img/main_title.svg") no-repeat center;
    background-size: cover;
  }
}
</style>
