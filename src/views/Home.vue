<script setup lang="ts">
import BookSpine from "../components/BookSpine.vue"
import Loading from "../components/kits/Loading.vue"
import {ref, reactive} from "vue";
import {useRouter} from "vue-router"
import {areImagesLoaded} from "../utils/imgLoaded"
import {getBooksData} from "../api/getBooksData"

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

interface IContents {
  title: string
  author: string
  dynasty: string
}

const loaded = ref(false)
const booksData = ref<Array<IContents>>([])
const router = useRouter()
const cursorSize = ref('')
const cursorText = ref('中国典籍·The Ancient Chinese Classics·')
const loading = ref(true)
getBooksData('contents').then((res) => booksData.value = res.data)
const getData = async () => {
  const font = new FontFace('carved', 'url(./assets/fonts/carved.woff)');
  try {
    const loadedFont = await font.load();
    document.fonts.add(loadedFont);
    setTimeout(() => {
      loading.value = false
    }, 3000)
  } catch (error) {
    console.error('Font not loaded:', error);
  }
}
getData()

const handleMouseEnter = (text) => {
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
      <div
          v-if="loaded"
          class="title"
          v-motion
          :initial="titleMotionOption.initial"
          :enter="titleMotionOption.enter"
          :delay="500"
          @mouseenter="cursorSize = 'large';cursorText='中国典籍·The Ancient Chinese Classics·'"
          @mouseleave="cursorSize = ''"
      ></div>
      <div class="book-shelf" v-if="loaded">
        <template v-for="(book,index) in booksData">
          <book-spine
              v-motion
              :initial="motionOption.initial"
              :enter="motionOption.enter"
              :delay="80 * index"
              :title="book.title"
              :author="book.author"
              :dynasty="book.dynasty"
              @click.native="router.push('about')"
              @mouseenter="handleMouseEnter(book.title)"
              @mouseleave="cursorSize = ''"
          />
        </template>
      </div>
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

  .book-shelf {
    display: flex;
    justify-content: center;
    gap: 24px;
  }

}
</style>
