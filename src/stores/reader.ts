import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { bookSlug, defaultSettings } from '@/utils/reader'
import type { ReaderEntry, ReaderSettings, ReadingProgress } from '@/utils/reader'

const KEY = 'acc-reader-v1'
const isIndex = (value: unknown) => Number.isSafeInteger(value) && Number(value) >= 0
export const useReader = defineStore('reader', () => {
  let saved: Record<string, any> = {}
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}
  } catch {
    /* Start with defaults if saved data is unavailable. */
  }
  const candidate = saved.settings || {}
  const settings = ref<ReaderSettings>({
    fontSize: [18, 20, 22, 24, 26, 28, 30, 32].includes(candidate.fontSize)
      ? candidate.fontSize
      : defaultSettings.fontSize,
    columnWidth: [48, 56, 64, 72, 80].includes(candidate.columnWidth)
      ? candidate.columnWidth
      : defaultSettings.columnWidth,
    direction: candidate.direction === 'horizontal' ? 'horizontal' : 'vertical',
    theme: ['paper', 'light', 'night'].includes(candidate.theme) ? candidate.theme : 'paper',
    rules: typeof candidate.rules === 'boolean' ? candidate.rules : true,
  })
  const validLocation = (item: any) =>
    item &&
    typeof item.book === 'string' &&
    !!bookSlug(item.book) &&
    isIndex(item.chapter) &&
    isIndex(item.paragraph) &&
    isIndex(item.offset)
  const progress = ref<Record<string, ReadingProgress>>(
    Object.fromEntries(
      Object.entries(saved.progress || {}).filter(
        ([name, item]: [string, any]) =>
          name === item?.book &&
          validLocation(item) &&
          typeof item.chapterTitle === 'string' &&
          typeof item.excerpt === 'string' &&
          Number.isFinite(item.percentage) &&
          Number.isFinite(item.updatedAt),
      ),
    ) as Record<string, ReadingProgress>,
  )
  const entries = ref<ReaderEntry[]>(
    Array.isArray(saved.entries)
      ? saved.entries.filter(
          (item: any) =>
            validLocation(item) &&
            typeof item.id === 'string' &&
            typeof item.text === 'string' &&
            typeof item.note === 'string' &&
            typeof item.chapterTitle === 'string' &&
            Number.isFinite(item.createdAt) &&
            ['bookmark', 'excerpt'].includes(item.type),
        )
      : [],
  )
  const storageError = ref('')
  watch(
    [settings, progress, entries],
    () => {
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify({
            settings: settings.value,
            progress: progress.value,
            entries: entries.value,
          }),
        )
        storageError.value = ''
      } catch {
        storageError.value = '浏览器未能保存阅读记录，请检查可用空间或存储权限。'
      }
    },
    { deep: true, flush: 'sync' },
  )
  const recent = computed(() =>
    Object.values(progress.value).sort((a, b) => b.updatedAt - a.updatedAt),
  )
  function recordProgress(item: ReadingProgress) {
    progress.value[item.book] = item
  }
  function addEntry(item: Omit<ReaderEntry, 'id' | 'createdAt' | 'note'>) {
    const existing = entries.value.find(
      (entry) =>
        entry.book === item.book &&
        entry.chapter === item.chapter &&
        entry.paragraph === item.paragraph &&
        entry.type === item.type &&
        (item.type === 'bookmark' || entry.text === item.text),
    )
    if (existing) return existing.id
    const id =
      typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    entries.value.unshift({ ...item, id, note: '', createdAt: Date.now() })
    return id
  }
  function removeEntry(id: string) {
    entries.value = entries.value.filter((entry) => entry.id !== id)
  }
  function resetSettings() {
    settings.value = { ...defaultSettings }
  }
  return {
    settings,
    progress,
    entries,
    recent,
    storageError,
    recordProgress,
    addEntry,
    removeEntry,
    resetSettings,
  }
})
