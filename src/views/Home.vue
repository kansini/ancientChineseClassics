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
  },
  leave: {
    opacity: 0,
    y: 240,
    scale: .5
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
    scale: 1,
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

const booksData = ref<Array<IContents>>([])
const router = useRouter()
const cursorSize = ref('')
const loading = ref(true)
getBooksData('contents').then((res) => booksData.value = res.data)
const getData = async () => {
  const font = new FontFace('carved', 'url(./assets/fonts/carved.woff)');
  try {
    const loadedFont = await font.load();
    document.fonts.add(loadedFont);
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('Font not loaded:', error);
  }
}
getData()
</script>

<template>
  <loading :loading="loading"/>
  <custom-cursor :size="cursorSize"/>
  <div class="home">
    <div
        class="title"
        v-motion
        :initial="titleMotionOption.initial"
        :enter="titleMotionOption.enter"
        :delay="1000"
        @mouseenter="cursorSize = 'large'"
        @mouseleave="cursorSize = ''"
    ></div>
    <div class="book-shelf">
      <template v-for="(book,index) in booksData">
        <book-spine
            v-motion
            :initial="motionOption.initial"
            :enter="motionOption.enter"
            :delay="500 + 80 * index"
            :title="book.title"
            :author="book.author"
            :dynasty="book.dynasty"
            @click.native="router.push('about')"
            @mouseenter="cursorSize = 'large'"
            @mouseleave="cursorSize = ''"
        />
      </template>
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
