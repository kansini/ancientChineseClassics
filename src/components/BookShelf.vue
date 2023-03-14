<script lang="ts" setup>
import {ref, reactive} from "vue";
import {useRouter} from "vue-router"
import {getBooksData} from "../api/getBooksData"
import BookSpine from "../components/BookSpine.vue"

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

interface IContents {
  title: string
  author: string
  dynasty: string
}

const booksData = ref<Array<IContents>>([])
const router = useRouter()

const emit = defineEmits(['mouseenter', 'mouseleave'])
const handleMouseEnter = (title: string) => {
  emit('mouseenter', title)
}
const handleMouseLeave = () => {
  emit('mouseleave')
}
getBooksData('contents').then((res) => booksData.value = res.data)
</script>
<template>
  <div class="book-shelf">
    <template v-for="(book,index) in booksData">
      <book-spine
          v-motion
          :initial="motionOption.initial"
          :enter="motionOption.enter"
          :delay="80 * index"
          :title="book.title"
          :author="book.author"
          :dynasty="book.dynasty"
          @click.native="router.push('book')"
          @mouseenter="handleMouseEnter(book.title)"
          @mouseleave="handleMouseLeave"
      />
    </template>
  </div>

</template>
<style lang="scss" scoped>
.book-shelf {
  display: flex;
  justify-content: center;
  gap: 24px;
}
</style>