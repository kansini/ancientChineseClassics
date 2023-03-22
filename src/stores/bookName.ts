import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useBookName = defineStore('bookName', () => {
  const bookName = ref<string>('三十六计')
  return { bookName }
})