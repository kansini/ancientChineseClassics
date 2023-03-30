<script lang="ts" setup>
import {ref, reactive} from "vue";
import {useRouter} from "vue-router"
import {getBooksData} from "../api/getBooksData"
import {useBookName} from '@/stores/bookName';
import type {IContents} from "../interface"
import {setLS, getLS} from "@/utils/ls";

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

const booksData = ref<IContents[]>([])
const router = useRouter()

const emit = defineEmits(['mouseenter', 'mouseleave'])
const handleMouseEnter = (title: string) => {
  emit('mouseenter', title)
}
const handleMouseLeave = () => {
  emit('mouseleave')
}
const handleClickBook = (bookName: string) => {
  router.push('book')
  useBookName().bookName = bookName
}
getBooksData('contents').then(async (res) => {
      const data = res.data
      await setLS('contents', data)
      booksData.value = getLS('contents') || data
    }
)
// const shelfData = getLS('contents') || booksData
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
          @click="handleClickBook(book.title)"
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