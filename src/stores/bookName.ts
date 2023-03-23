import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useBookName = defineStore('bookName', () => {
  const bookName = ref<string>('梦溪笔谈')
  return { bookName }
})