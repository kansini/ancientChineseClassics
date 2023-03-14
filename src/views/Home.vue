<script setup lang="ts">
import BookShelf from "../components/BookShelf.vue"
import Loading from "../components/kits/Loading.vue"
import {ref, reactive} from "vue";
import {areImagesLoaded} from "../utils/imgLoaded"

const motionOption = reactive({
  initial: {
    opacity: 0,
    y: 240,
    scale: .5
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1
  }
})
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

const loaded = ref(false)
const cursorSize = ref('')
const cursorText = ref('中国典籍·The Ancient Chinese Classics·')
const loading = ref(true)
const getData = async () => {
  const font = new FontFace('carved', 'url(./assets/fonts/carved.woff)');
  try {
    const loadedFont = await font.load();
    document.fonts.add(loadedFont);
    setTimeout(() => {
      loading.value = false
    })
  } catch (error) {
    console.error('Font not loaded:', error);
  }
}
getData()

const handleMouseEnter = (text: string) => {
  cursorSize.value = "large"
  cursorText.value = `·中国典籍·${text}·中国典籍·${text}`
}
</script>

<template>
  <div>
    <loading :loading="loading" @enter="loaded = true"/>
    <custom-cursor
        :size="cursorSize"
        :text="cursorText"
    />
    <div class="home">
      <div v-if="loaded"
           class="title"
           v-motion
           :initial="titleMotionOption.initial"
           :enter="titleMotionOption.enter"
           :delay="500"
      >

      </div>
      <book-shelf
          v-if="loaded"
          @mouseenter="handleMouseEnter"
          @mouseleave="cursorSize = ''"
      />
    </div>
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
