<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBooksData } from '@/api/getBooksData'
import { useBookName } from '@/stores/bookName'
import type { IContents } from '@/interface'
import { setLS, getLS } from '@/utils/ls'
import BookSpine from '@/components/BookSpine.vue'
import { readerLink } from '@/utils/reader'

const motionOption = reactive({
  initial: {
    opacity: 0,
    y: 240,
    scale: 0.5,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
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
  useBookName().bookName = bookName
  router.push(readerLink(bookName))
}
const loading = ref(true)
const error = ref('')
const getData = async () => {
  loading.value = true
  error.value = ''
  try {
    const cached = getLS('contents')
    const data = Array.isArray(cached) ? cached : (await getBooksData('contents')).data
    if (!Array.isArray(data)) throw new Error('Invalid catalogue')
    booksData.value = data
    setLS('contents', data)
  } catch {
    error.value = '书架暂未载入，请重试。'
  } finally {
    loading.value = false
  }
}
onMounted(async () => {
  getData()
})

// const shelfData = getLS('contents') || booksData
</script>
<template>
  <div class="book-shelf">
    <p v-if="loading" role="status" class="shelf-status">正在整理书架…</p>
    <p v-else-if="error" role="alert" class="shelf-status">
      {{ error }} <button @click="getData">重新载入</button>
    </p>
    <template v-for="(book, index) in booksData">
      <book-spine
        v-motion
        :initial="motionOption.initial"
        :enter="motionOption.enter"
        :delay="80 + 60 * Math.min(index, 6)"
        :data="book"
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
  flex-wrap: wrap;
  gap: 24px;
  margin: 0 auto;
  .shelf-status {
    font:
      14px system-ui,
      sans-serif;
    color: #806e56;
    padding: 32px 0;
    button {
      background: none;
      border: 1px solid #9c7f59;
      color: inherit;
      padding: 8px 12px;
      cursor: pointer;
    }
  }
}
</style>
