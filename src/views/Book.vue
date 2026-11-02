<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import Cover from '@/components/Cover.vue'
import Detail from '@/components/Detail.vue'
import Contents from '@/components/Contents.vue'
import Intro from '@/components/Intro.vue'
import ReaderDrawer from '@/components/reader/ReaderDrawer.vue'
import { useBookName } from '@/stores/bookName'
import { useReader } from '@/stores/reader'
import { loadBook } from '@/utils/loadBook'
import {
  bookFromSlug,
  chapterId,
  highlightText,
  paragraphId,
  parseAnchor,
  rangeAtOffset,
  readerLink,
  searchBook,
} from '@/utils/reader'
import type { BookData, ReaderEntry, ReadingLocation } from '@/utils/reader'

const route = useRoute(),
  router = useRouter(),
  reader = useReader()
const bookName = computed(() => bookFromSlug(String(route.params.slug || '')))
const book = ref<BookData | null>(null),
  loading = ref(true),
  error = ref('')
const ready = ref(false),
  navigating = ref(false)
const detail = ref<InstanceType<typeof Detail>>(),
  main = ref<HTMLElement>(),
  topbar = ref<HTMLElement>()
const panel = ref<'search' | 'settings' | 'saved' | ''>('')
const showContents = ref(false),
  showIntro = ref(false)
const active = ref<ReadingLocation>({ chapter: 0, paragraph: 0, offset: 0 })
const query = ref(''),
  searchQuery = ref(''),
  savedFilter = ref('all'),
  toast = ref('')
const selection = ref<{ text: string; location: ReadingLocation } | null>(null)
let suppressCaptureUntil = 0,
  navigation = 0
let resizeTimer: ReturnType<typeof setTimeout> | undefined,
  selectionTimer: ReturnType<typeof setTimeout> | undefined
let request = 0,
  scrollTimer: ReturnType<typeof setTimeout> | undefined,
  queryTimer: ReturnType<typeof setTimeout> | undefined,
  toastTimer: ReturnType<typeof setTimeout> | undefined
const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
const headerOffset = () => (topbar.value?.getBoundingClientRect().height || 72) + 20
const currentArticle = computed(() => book.value?.articles[active.value.chapter])
const currentText = computed(() => currentArticle.value?.content[active.value.paragraph] || '')
const savedProgress = computed(() => reader.progress[bookName.value])
const ownEntries = computed(() => reader.entries.filter((entry) => entry.book === bookName.value))
const filteredEntries = computed(() =>
  ownEntries.value.filter(
    (entry) => savedFilter.value === 'all' || entry.type === savedFilter.value,
  ),
)
const bookmarks = computed(() =>
  ownEntries.value
    .filter((entry) => entry.type === 'bookmark')
    .map((entry) => `${entry.chapter}:${entry.paragraph}`),
)
const currentBookmark = computed(() =>
  ownEntries.value.find(
    (entry) =>
      entry.type === 'bookmark' &&
      entry.chapter === active.value.chapter &&
      entry.paragraph === active.value.paragraph,
  ),
)
const results = computed(() => searchBook(book.value?.articles || [], searchQuery.value))
const pageStyle = computed(() => ({
  '--reader-font-size': `${reader.settings.fontSize}px`,
  '--column-width': `${reader.settings.columnWidth}px`,
}))
const hasChapter = computed(() => route.params.chapter !== undefined && route.params.chapter !== '')
const chapterInvalid = computed(
  () =>
    !!book.value &&
    hasChapter.value &&
    (!/^\d+$/.test(String(route.params.chapter)) ||
      Number(route.params.chapter) < 1 ||
      Number(route.params.chapter) > book.value.articles.length),
)
const paragraphOffsets = computed(() => {
  let total = 0
  const offsets =
    book.value?.articles.map((article) =>
      article.content.map((text) => {
        const start = total
        total += text.length
        return start
      }),
    ) || []
  return { offsets, total }
})
function notify(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 3000)
}
async function fetchBook() {
  const version = ++request
  navigation++
  loading.value = true
  error.value = ''
  book.value = null
  ready.value = false
  panel.value = ''
  showContents.value = false
  showIntro.value = false
  query.value = ''
  searchQuery.value = ''
  selection.value = null
  active.value = { chapter: 0, paragraph: 0, offset: 0 }
  if (!bookName.value) {
    loading.value = false
    error.value = '这部典籍暂未收录'
    return
  }
  useBookName().bookName = bookName.value
  try {
    const data = await loadBook(bookName.value)
    if (version !== request) return
    if (!data.articles.length) throw new Error('empty')
    book.value = data
  } catch {
    if (version === request) error.value = '书籍暂时未能载入，请重试。'
  } finally {
    if (version === request) loading.value = false
  }
}
watch(() => route.params.slug, fetchBook, { immediate: true })
function boundedLocation(location: ReadingLocation): ReadingLocation {
  const chapter = Math.min(Math.max(0, location.chapter), (book.value?.articles.length || 1) - 1)
  const content = book.value?.articles[chapter]?.content || []
  const paragraph = Math.min(Math.max(0, location.paragraph), Math.max(0, content.length - 1))
  return {
    chapter,
    paragraph,
    offset: Math.min(
      Math.max(0, location.offset),
      Math.max(0, (content[paragraph]?.length || 0) - 1),
    ),
  }
}
function remember(location = active.value) {
  if (!book.value || !ready.value || chapterInvalid.value) return
  const text = book.value.articles[location.chapter]?.content[location.paragraph] || ''
  const position =
    (paragraphOffsets.value.offsets[location.chapter]?.[location.paragraph] || 0) + location.offset
  reader.recordProgress({
    ...location,
    book: bookName.value,
    chapterTitle: book.value.articles[location.chapter].title,
    excerpt: text.slice(location.offset, location.offset + 60),
    percentage: Math.min(
      100,
      Math.round((position / Math.max(1, paragraphOffsets.value.total)) * 100),
    ),
    updatedAt: Date.now(),
  })
}
async function scrollToLocation(location: ReadingLocation) {
  const token = ++navigation
  navigating.value = true
  suppressCaptureUntil = performance.now() + 1000
  clearTimeout(scrollTimer)
  const target = boundedLocation(location)
  await nextTick()
  await detail.value?.relayout()
  await frame()
  await frame()
  if (token !== navigation) return
  const paragraph = document.getElementById(
    paragraphId(bookName.value, target.chapter, target.paragraph),
  )
  const element = paragraph || document.getElementById(chapterId(bookName.value, target.chapter))
  if (element) {
    const rect = paragraph
      ? rangeAtOffset(paragraph, target.offset)?.getBoundingClientRect() ||
        paragraph.getBoundingClientRect()
      : element.getBoundingClientRect()
    window.scrollTo({
      top: Math.max(0, window.scrollY + rect.top - headerOffset()),
      behavior: 'auto',
    })
    active.value = target
  }
  await frame()
  navigating.value = false
  suppressCaptureUntil = performance.now() + 500
  remember(target)
}
async function followRoute() {
  if (!ready.value || !book.value || chapterInvalid.value) return
  if (hasChapter.value)
    await scrollToLocation({
      chapter: Number(route.params.chapter) - 1,
      ...parseAnchor(route.hash),
    })
  else {
    navigation++
    navigating.value = false
    window.scrollTo({ top: 0, behavior: 'auto' })
    active.value = { chapter: 0, paragraph: 0, offset: 0 }
  }
}
async function detailReady() {
  ready.value = true
  await followRoute()
}
watch(() => [route.params.chapter, route.hash], followRoute)
async function go(location: ReadingLocation) {
  panel.value = ''
  showContents.value = false
  selection.value = null
  const path = readerLink(bookName.value, location)
  if (route.fullPath === path) await scrollToLocation(location)
  else await router.push(path)
}
function showDirectory() {
  panel.value = ''
  showContents.value = true
}
function showBiography() {
  panel.value = ''
  showIntro.value = true
}
function clearSearch() {
  query.value = ''
  searchQuery.value = ''
}
function removeSaved(id: string) {
  reader.removeEntry(id)
  notify('已移除记录')
}
function chooseChapter(id: string) {
  const chapter =
    book.value?.articles.findIndex((_, index) => chapterId(bookName.value, index) === id) ?? -1
  if (chapter >= 0) go({ chapter, paragraph: 0, offset: 0 })
}
function caretOffset(element: HTMLElement, x: number, y: number) {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null
    caretRangeFromPoint?: (x: number, y: number) => Range | null
  }
  const caret = doc.caretRangeFromPoint?.(x, y)
  const position = !caret ? doc.caretPositionFromPoint?.(x, y) : null
  const node = caret?.startContainer || position?.offsetNode
  if (!node || !element.contains(node)) return 0
  const prefix = document.createRange()
  prefix.setStart(element, 0)
  prefix.setEnd(node, caret?.startOffset ?? position?.offset ?? 0)
  return prefix.toString().length
}
function capturePosition() {
  if (
    performance.now() < suppressCaptureUntil ||
    !ready.value ||
    navigating.value ||
    panel.value ||
    showContents.value ||
    showIntro.value ||
    !main.value
  )
    return
  const threshold = headerOffset()
  const articles = Array.from(main.value.querySelectorAll<HTMLElement>('.article'))
  const article = articles.find((el) => {
    const r = el.getBoundingClientRect()
    return r.bottom > threshold && r.top < innerHeight - 70
  })
  if (!article) return
  let best: { element: HTMLElement; rect: DOMRect; score: number } | null = null
  for (const element of article.querySelectorAll<HTMLElement>('.graph')) {
    const box = element.getBoundingClientRect()
    if (box.bottom <= threshold || box.top >= innerHeight - 70) continue
    const range = document.createRange()
    range.selectNodeContents(element)
    for (const rect of range.getClientRects()) {
      if (rect.bottom <= threshold || rect.top >= innerHeight - 70 || !rect.width || !rect.height)
        continue
      const score =
        Math.max(threshold, rect.top) * 10000 +
        (reader.settings.direction === 'vertical' ? -rect.right : rect.left)
      if (!best || score < best.score) best = { element, rect, score }
    }
  }
  if (!best) return
  const { element, rect } = best
  active.value = {
    chapter: Number(element.dataset.chapter),
    paragraph: Number(element.dataset.paragraph),
    offset: caretOffset(
      element,
      reader.settings.direction === 'vertical' ? rect.left + rect.width / 2 : rect.left + 2,
      Math.max(threshold + 2, rect.top + 2),
    ),
  }
  remember()
}
function scheduleCapture() {
  if (navigating.value || performance.now() < suppressCaptureUntil) return
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(capturePosition, 160)
}
useEventListener(window, 'scroll', scheduleCapture, { passive: true })
useEventListener(window, 'pagehide', capturePosition)
useEventListener(window, 'resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    if (ready.value && main.value && window.scrollY >= main.value.offsetTop - headerOffset())
      scrollToLocation({ ...active.value })
  }, 120)
})
useEventListener(document, 'selectionchange', () => {
  clearTimeout(selectionTimer)
  if (!panel.value && !showContents.value && !showIntro.value)
    selectionTimer = setTimeout(captureSelection, 80)
})
useEventListener(document, 'visibilitychange', () => {
  if (document.hidden) capturePosition()
})
watch(
  () => [reader.settings.fontSize, reader.settings.columnWidth, reader.settings.direction],
  async () => {
    if (!ready.value || !main.value || window.scrollY < main.value.offsetTop - headerOffset())
      return
    await scrollToLocation({ ...active.value })
  },
  { flush: 'post' },
)
watch(query, (value) => {
  clearTimeout(queryTimer)
  queryTimer = setTimeout(() => (searchQuery.value = value.trim()), 180)
})
function openPanel(value: 'search' | 'settings' | 'saved') {
  capturePosition()
  panel.value = value
  showContents.value = false
  showIntro.value = false
}
function clickParagraph(event: MouseEvent) {
  if (window.getSelection()?.toString()) return
  const element = (event.target as HTMLElement).closest<HTMLElement>('.graph')
  if (!element) return
  active.value = {
    chapter: Number(element.dataset.chapter),
    paragraph: Number(element.dataset.paragraph),
    offset: caretOffset(element, event.clientX, event.clientY),
  }
  remember()
}
function captureSelection() {
  const selected = window.getSelection()
  if (!selected || selected.isCollapsed || !selected.rangeCount) {
    selection.value = null
    return
  }
  const range = selected.getRangeAt(0)
  if (!main.value?.contains(range.startContainer) || !main.value.contains(range.endContainer)) {
    selection.value = null
    return
  }
  const start =
    range.startContainer.nodeType === Node.ELEMENT_NODE
      ? (range.startContainer as HTMLElement)
      : range.startContainer.parentElement
  const element = start?.closest<HTMLElement>('.graph')
  const text = selected.toString().trim()
  if (!element || !text) return
  const prefix = document.createRange()
  prefix.setStart(element, 0)
  prefix.setEnd(range.startContainer, range.startOffset)
  selection.value = {
    text,
    location: {
      chapter: Number(element.dataset.chapter),
      paragraph: Number(element.dataset.paragraph),
      offset: prefix.toString().length,
    },
  }
}
function toggleBookmark() {
  if (currentBookmark.value) {
    reader.removeEntry(currentBookmark.value.id)
    notify('已移除此段书签')
    return
  }
  if (!currentText.value) return
  reader.addEntry({
    ...active.value,
    book: bookName.value,
    chapterTitle: currentArticle.value?.title || '',
    text: currentText.value,
    type: 'bookmark',
  })
  notify('已为当前段落添加书签')
}
function clearSelection() {
  selection.value = null
  window.getSelection()?.removeAllRanges()
}
function saveExcerpt() {
  if (!selection.value || !book.value) return
  const { location, text } = selection.value
  reader.addEntry({
    ...location,
    book: bookName.value,
    chapterTitle: book.value.articles[location.chapter].title,
    text,
    type: 'excerpt',
  })
  selection.value = null
  window.getSelection()?.removeAllRanges()
  panel.value = 'saved'
  savedFilter.value = 'excerpt'
  notify('摘录已保存，可继续添加批注')
}
async function copy(text: string, message = '已复制') {
  try {
    await navigator.clipboard.writeText(text)
    notify(message)
  } catch {
    notify('未能复制，请检查浏览器的剪贴板权限。')
  }
}
function copyLink() {
  copy(
    new URL(router.resolve(readerLink(bookName.value, active.value)).href, window.location.origin)
      .href,
    '已复制当前阅读位置的链接',
  )
}
function copyEntry(entry: ReaderEntry) {
  copy(
    `${entry.text}\n——《${entry.book}》·${entry.chapterTitle}${entry.note ? `\n批注：${entry.note}` : ''}`,
  )
}
onBeforeUnmount(() => {
  capturePosition()
  request++
  clearTimeout(scrollTimer)
  clearTimeout(queryTimer)
  clearTimeout(toastTimer)
  clearTimeout(resizeTimer)
  clearTimeout(selectionTimer)
})
</script>

<template>
  <div class="reader-page" :data-theme="reader.settings.theme" :style="pageStyle">
    <header ref="topbar" class="reader-topbar">
      <div class="reader-identity">
        <RouterLink to="/home" class="shelf-link" aria-label="返回书架">← 书架</RouterLink
        ><span class="identity-divider" />
        <h1>{{ bookName || '中国典籍' }}</h1>
        <span v-if="book" class="identity-caption">{{ book.dynasty }} · {{ book.author }}</span>
      </div>
      <nav v-if="book" class="reader-actions" aria-label="阅读工具">
        <button @click="showDirectory">目录</button
        ><button :aria-pressed="panel === 'search'" @click="openPanel('search')">搜索</button
        ><button :aria-pressed="panel === 'settings'" @click="openPanel('settings')">设置</button
        ><button :aria-pressed="panel === 'saved'" @click="openPanel('saved')">
          书笺
          <span v-if="ownEntries.length" class="entry-count">{{ ownEntries.length }}</span></button
        ><button @click="showBiography">简介</button>
      </nav>
    </header>
    <div v-if="loading" class="reader-state" role="status">
      <span class="state-seal">卷</span>
      <p>正在展卷…</p>
    </div>
    <div v-else-if="error || chapterInvalid" class="reader-state" role="alert">
      <span class="state-seal">卷</span>
      <h2>{{ error || '这一章节不存在' }}</h2>
      <p>可以回到书架选书，或重新打开本书。</p>
      <div class="state-actions">
        <RouterLink to="/home">返回书架</RouterLink
        ><button v-if="error && bookName" @click="fetchBook">重新载入</button
        ><RouterLink v-if="chapterInvalid" :to="readerLink(bookName)">本书首页</RouterLink>
      </div>
    </div>
    <template v-else-if="book">
      <section class="reader-hero">
        <Cover :name="bookName" />
        <div class="hero-bottom">
          <p class="hero-kicker">展卷有时 · 阅读无界</p>
          <p class="hero-meta">
            {{ book.dynasty }} · {{ book.author }}<span>共 {{ book.articles.length }} 篇</span>
          </p>
          <button
            class="primary-button"
            @click="go(savedProgress || { chapter: 0, paragraph: 0, offset: 0 })"
          >
            {{ savedProgress ? '继续阅读' : '开始阅读' }} <span aria-hidden="true">↓</span>
          </button>
          <p v-if="savedProgress" class="hero-resume">
            上次读到 · {{ savedProgress.chapterTitle }}
          </p>
        </div>
      </section>
      <main
        ref="main"
        class="reader-content"
        aria-label="正文"
        @click="clickParagraph"
        @mouseup="captureSelection"
        @touchend="captureSelection"
      >
        <Detail
          ref="detail"
          :key="bookName"
          :name="bookName"
          :articles="book.articles"
          :settings="reader.settings"
          :query="searchQuery"
          :bookmarked="bookmarks"
          @ready="detailReady"
        />
      </main>
      <footer class="reader-bottom-bar">
        <div class="reading-location">
          <span class="reading-overline">正在读</span
          ><span class="current-chapter">{{ currentArticle?.title }}</span
          ><span class="reading-percent">{{ savedProgress?.percentage || 0 }}%</span>
        </div>
        <div class="bottom-actions">
          <button
            :disabled="active.chapter === 0"
            aria-label="上一章"
            @click="go({ chapter: active.chapter - 1, paragraph: 0, offset: 0 })"
          >
            上一章</button
          ><button
            :class="{ 'is-saved': currentBookmark }"
            :aria-pressed="!!currentBookmark"
            @click="toggleBookmark"
          >
            {{ currentBookmark ? '已加书签' : '加书签' }}</button
          ><button
            :disabled="active.chapter >= book.articles.length - 1"
            aria-label="下一章"
            @click="go({ chapter: active.chapter + 1, paragraph: 0, offset: 0 })"
          >
            下一章</button
          ><button class="share-button" @click="copyLink">分享</button>
        </div>
        <div class="reading-progress-track">
          <span :style="{ width: `${savedProgress?.percentage || 0}%` }" />
        </div>
      </footer>
      <Contents
        :key="`contents-${bookName}`"
        :name="bookName"
        v-model:visible="showContents"
        @click="chooseChapter"
      />
      <Intro :key="`intro-${bookName}`" :name="bookName" v-model:visible="showIntro" />
    </template>
    <ReaderDrawer
      :open="!!panel"
      :title="panel === 'search' ? '书内寻文' : panel === 'settings' ? '阅览设置' : '我的书笺'"
      :subtitle="
        panel === 'search'
          ? `在《${bookName}》中寻找文字`
          : panel === 'settings'
            ? '依自己的习惯，安静读一卷'
            : `《${bookName}》· ${ownEntries.length} 条记录`
      "
      @close="panel = ''"
    >
      <section v-if="panel === 'search'" class="search-panel">
        <label for="reader-search">输入原文关键词</label>
        <div class="search-field">
          <input
            id="reader-search"
            v-model="query"
            data-autofocus
            type="search"
            maxlength="100"
            placeholder="例如：修身、山川、天地"
            autocomplete="off"
            @keydown.enter="searchQuery = query.trim()"
          /><span aria-hidden="true">⌕</span>
        </div>
        <p class="panel-hint">结果包含原文上下文，点击即可回到正文。</p>
        <div v-if="!searchQuery" class="panel-empty">
          <span>寻</span>
          <p>一字一句，皆有来处。</p>
          <small>输入关键词，查找本书中的段落。</small>
        </div>
        <template v-else
          ><p class="results-count">
            找到 {{ results.total }} 个相关段落<span v-if="results.total > 100">
              · 显示前 100 条，请缩小搜索范围</span
            >
          </p>
          <button
            v-for="result in results.results"
            :key="`${result.chapter}:${result.paragraph}`"
            class="search-result"
            @click="go(result)"
          >
            <span class="result-title"
              >{{ result.title }} <small>第 {{ result.paragraph + 1 }} 段 ↗</small></span
            ><span class="result-snippet"
              ><template v-for="(part, i) in highlightText(result.snippet, searchQuery)" :key="i"
                ><mark v-if="part.match">{{ part.text }}</mark
                ><template v-else>{{ part.text }}</template></template
              ></span
            >
          </button>
          <p v-if="!results.total" class="no-results">
            没有找到“{{ searchQuery }}”。试试更短的关键词。
          </p>
          <button class="text-button" @click="clearSearch">清除搜索与正文高亮</button></template
        >
      </section>
      <section v-if="panel === 'settings'" class="settings-panel">
        <div class="setting-group">
          <h3>排版方向</h3>
          <div class="segmented">
            <button
              :aria-pressed="reader.settings.direction === 'vertical'"
              @click="reader.settings.direction = 'vertical'"
            >
              纵读 · 竖排</button
            ><button
              :aria-pressed="reader.settings.direction === 'horizontal'"
              @click="reader.settings.direction = 'horizontal'"
            >
              横读 · 横排
            </button>
          </div>
        </div>
        <div class="setting-group setting-row">
          <div>
            <h3>正文字号</h3>
            <p>舒适，比看得更多更重要</p>
          </div>
          <div class="stepper">
            <button
              aria-label="减小字号"
              :disabled="reader.settings.fontSize <= 18"
              @click="reader.settings.fontSize -= 2"
            >
              −</button
            ><output aria-live="polite">{{ reader.settings.fontSize }}</output
            ><button
              aria-label="增大字号"
              :disabled="reader.settings.fontSize >= 32"
              @click="reader.settings.fontSize += 2"
            >
              ＋
            </button>
          </div>
        </div>
        <div class="setting-group setting-row">
          <div>
            <label for="column-width">竖排列距</label>
            <p>文字与分割线同步调整</p>
          </div>
          <select
            id="column-width"
            v-model.number="reader.settings.columnWidth"
            :disabled="reader.settings.direction === 'horizontal'"
          >
            <option v-for="width in [48, 56, 64, 72, 80]" :key="width" :value="width">
              {{ width }} px
            </option>
          </select>
        </div>
        <div class="setting-group">
          <h3>纸面颜色</h3>
          <div class="theme-choices">
            <button
              v-for="theme in [
                { id: 'paper', label: '纸本' },
                { id: 'light', label: '素白' },
                { id: 'night', label: '夜读' },
              ]"
              :key="theme.id"
              :class="`theme-${theme.id}`"
              :aria-pressed="reader.settings.theme === theme.id"
              @click="reader.settings.theme = theme.id as 'paper' | 'light' | 'night'"
            >
              <span /><span>{{ theme.label }}</span>
            </button>
          </div>
        </div>
        <label class="setting-group setting-row rule-switch"
          ><span>显示竖排分割线</span
          ><input
            v-model="reader.settings.rules"
            type="checkbox"
            :disabled="reader.settings.direction === 'horizontal'"
        /></label>
        <div class="reading-preview" :style="{ fontSize: `${reader.settings.fontSize}px` }">
          {{ (currentText || '展卷有时，阅读无界。').slice(0, 42) }}
        </div>
        <button class="text-button" @click="reader.resetSettings()">恢复默认设置</button>
      </section>
      <section v-if="panel === 'saved'" class="saved-panel">
        <div class="segmented saved-tabs">
          <button
            v-for="tab in [
              { id: 'all', label: '全部' },
              { id: 'bookmark', label: '书签' },
              { id: 'excerpt', label: '摘录' },
            ]"
            :key="tab.id"
            :aria-pressed="savedFilter === tab.id"
            @click="savedFilter = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        <div v-if="!filteredEntries.length" class="panel-empty">
          <span>笺</span>
          <p>把想重读的文字，留在案头。</p>
          <small>用底部“加书签”保存当前段落，<br />或在正文选中文字后保存摘录。</small>
        </div>
        <article v-for="entry in filteredEntries" :key="entry.id" class="saved-card">
          <div class="saved-card-top">
            <span>{{ entry.type === 'bookmark' ? '书签' : '摘录' }} · {{ entry.chapterTitle }}</span
            ><button
              :aria-label="`删除${entry.type === 'bookmark' ? '书签' : '摘录'}`"
              @click="removeSaved(entry.id)"
            >
              移除
            </button>
          </div>
          <button class="saved-quote" @click="go(entry)">{{ entry.text }}</button
          ><label :for="`note-${entry.id}`" class="note-label">批注</label
          ><textarea
            :id="`note-${entry.id}`"
            v-model="entry.note"
            rows="2"
            placeholder="记下此刻的理解…"
            maxlength="10000"
          />
          <div class="saved-card-actions">
            <button @click="go(entry)">回到原文 ↗</button
            ><button @click="copyEntry(entry)">复制摘录与出处</button>
          </div>
        </article>
      </section>
      <p v-if="reader.storageError" class="storage-error" role="alert">{{ reader.storageError }}</p>
    </ReaderDrawer>
    <div v-if="selection && !panel" class="selection-toolbar">
      <span>已选 {{ selection.text.length }} 字</span
      ><button @mousedown.prevent @click="saveExcerpt">保存摘录</button
      ><button aria-label="取消文字选择" @click="clearSelection">×</button>
    </div>
    <div v-if="toast" class="reader-toast" role="status">{{ toast }}</div>
  </div>
</template>
<style lang="scss" scoped>
.reader-page {
  --reader-panel: #fff9ef;
  --reader-ink: #30261f;
  --reader-muted: #806f5c;
  --reader-border: #d9c9b1;
  --reader-rule: rgba(113, 89, 61, 0.33);
  --reader-accent: #88140a;
  --reader-highlight: #ecd295;
  --reader-seal: #73000e;
  min-height: 100vh;
  padding: 72px 0 82px;
  color: var(--reader-ink);
  background: transparent;
  &[data-theme='light'] {
    --reader-panel: #fff;
    --reader-ink: #292c2a;
    --reader-muted: #73766e;
    --reader-border: #d9ddd7;
    --reader-rule: #d5d9d3;
    --reader-highlight: #f4df96;
    background: #fff;
  }
  &[data-theme='night'] {
    --reader-panel: #252925;
    --reader-ink: #dfd8c9;
    --reader-muted: #aaa894;
    --reader-border: #464a41;
    --reader-rule: #44483d;
    --reader-accent: #dfaa82;
    --reader-highlight: #665638;
    --reader-seal: #663d36;
    background: #1d211e;
  }
  button,
  input,
  textarea,
  select {
    font: inherit;
  }
  button,
  a,
  input,
  select,
  textarea {
    touch-action: manipulation;
  }
  button {
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.35;
    cursor: default;
  }
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--reader-accent);
    outline-offset: 4px;
  }
  button {
    //color: inherit;
  }
  button:not(.primary-button) {
    -webkit-tap-highlight-color: transparent;
  }
  mark {
    background: var(--reader-highlight);
    color: inherit;
  }
}
.reader-topbar {
  position: fixed;
  inset: 0 0 auto;
  z-index: 30;
  min-height: 72px;
  padding: 12px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: var(--reader-panel);
  border-bottom: 1px solid var(--reader-border);
  font-family: system-ui, sans-serif;
}
.reader-identity {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
}
.shelf-link {
  font-size: 13px;
  color: var(--reader-muted);
  white-space: nowrap;
}
.identity-divider {
  height: 20px;
  width: 1px;
  background: var(--reader-border);
}
h1 {
  font-family: serif;
  font-size: 21px;
  font-weight: 500;
  white-space: nowrap;
}
.identity-caption {
  font-size: 11px;
  color: var(--reader-muted);
}
.reader-actions {
  display: flex;
  gap: 4px;
  white-space: nowrap;
}
.reader-actions button {
  border: 0;
  background: transparent;
  padding: 10px 13px;
  font-size: 13px;
  border-radius: 4px;
}
.reader-actions button:hover,
.reader-actions button[aria-pressed='true'] {
  background: var(--reader-border);
}
.entry-count {
  font-size: 10px;
  opacity: 0.7;
  margin-left: 3px;
}
.reader-hero {
  position: relative;
  min-height: calc(100svh - 155px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 16px 40px;
  :deep(.cover) {
    height: auto;
    min-height: 300px;
    width: 100%;
    gap: 24px;
  }
  :deep(.cover .title) {
    height: 210px;
  }
  :deep(.cover .illustration) {
    height: 220px;
  }
}
.hero-bottom {
  text-align: center;
  font-family: system-ui, sans-serif;
}
.hero-kicker {
  font-size: 11px;
  color: var(--reader-muted);
  letter-spacing: 4px;
  margin: 20px 0 14px;
}
.hero-meta {
  font-size: 12px;
  color: var(--reader-muted);
  span {
    margin-left: 16px;
    padding-left: 16px;
    border-left: 1px solid var(--reader-border);
  }
}
.primary-button {
  border: 0;
  background: var(--reader-accent);
  color: var(--reader-panel);
  padding: 13px 28px;
  margin: 24px 0 10px;
  font-family: serif;
  font-size: 17px;
  letter-spacing: 2px;
  span {
    margin-left: 20px;
  }
}
.hero-resume {
  color: var(--reader-muted);
  font-size: 11px;
}
.reader-content {
  padding-top: 16px;
}
.reader-bottom-bar {
  position: fixed;
  inset: auto 0 0;
  z-index: 25;
  background: var(--reader-panel);
  border-top: 1px solid var(--reader-border);
  padding: 12px 32px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font:
    12px system-ui,
    sans-serif;
}
.reading-location {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.reading-overline {
  color: var(--reader-muted);
  font-size: 10px;
}
.current-chapter {
  max-width: 32vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.reading-percent {
  color: var(--reader-muted);
  font-size: 11px;
}
.bottom-actions {
  display: flex;
  gap: 8px;
  white-space: nowrap;
}
.bottom-actions button {
  border: 1px solid var(--reader-border);
  background: none;
  padding: 7px 11px;
  border-radius: 3px;
}
.bottom-actions .is-saved {
  color: var(--reader-accent);
  border-color: var(--reader-accent);
}
.reading-progress-track {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--reader-border);
  span {
    display: block;
    height: 100%;
    background: var(--reader-accent);
    transition: width 0.2s;
  }
}
.reader-state {
  min-height: 75vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 28px;
  h2 {
    font-size: 24px;
    font-weight: 400;
  }
  p {
    font-size: 14px;
    color: var(--reader-muted);
  }
}
.state-seal {
  display: grid;
  place-items: center;
  width: 48px;
  height: 64px;
  background: var(--reader-accent);
  color: var(--reader-panel);
  font-size: 24px;
}
.state-actions {
  display: flex;
  gap: 12px;
  a,
  button {
    border: 1px solid var(--reader-border);
    padding: 10px 16px;
    color: inherit;
    background: none;
    font-size: 14px;
  }
}
.search-panel label,
.setting-group h3,
.setting-group label {
  font-size: 13px;
  font-weight: 500;
}
.search-field {
  position: relative;
  margin-top: 12px;
  input {
    width: 100%;
    border: 1px solid var(--reader-border);
    border-radius: 4px;
    background: transparent;
    color: inherit;
    padding: 13px 36px 13px 13px;
    font-size: 14px;
  }
  span {
    position: absolute;
    right: 12px;
    top: 6px;
    font-size: 26px;
    color: var(--reader-muted);
  }
}
.panel-hint {
  font-size: 11px;
  color: var(--reader-muted);
  line-height: 1.7;
  margin-top: 12px;
}
.panel-empty {
  text-align: center;
  padding: 64px 8px;
  color: var(--reader-muted);
  > span {
    font-family: serif;
    font-size: 38px;
    display: block;
    color: var(--reader-accent);
    margin-bottom: 24px;
  }
  p {
    font-family: serif;
    font-size: 16px;
    margin-bottom: 12px;
  }
  small {
    font-size: 12px;
    line-height: 1.9;
  }
}
.results-count {
  font-size: 12px;
  color: var(--reader-muted);
  margin: 28px 0 8px;
  span {
    display: block;
    font-size: 11px;
    margin-top: 6px;
  }
}
.search-result {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  border-bottom: 1px solid var(--reader-border);
  background: transparent;
  padding: 18px 0;
}
.result-title {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--reader-accent);
  small {
    font-size: 10px;
    color: var(--reader-muted);
    white-space: nowrap;
  }
}
.result-snippet {
  display: block;
  font-family: serif;
  font-size: 16px;
  line-height: 1.9;
  margin-top: 10px;
  overflow-wrap: anywhere;
}
.no-results {
  padding: 36px 0;
  font-size: 13px;
  color: var(--reader-muted);
  line-height: 1.8;
}
.text-button {
  border: 0;
  border-bottom: 1px solid var(--reader-border);
  padding: 6px 0;
  background: none;
  font-size: 12px;
  color: var(--reader-muted);
  margin-top: 24px;
}
.setting-group {
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--reader-border);
  h3 {
    margin-bottom: 12px;
  }
  p {
    font-size: 11px;
    color: var(--reader-muted);
    margin-top: 7px;
  }
  .setting-row h3 {
    margin-bottom: 0;
  }
}
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  h3 {
    margin-bottom: 0;
  }
}
.segmented {
  display: flex;
  padding: 4px;
  background: var(--reader-border);
  border-radius: 5px;
  gap: 4px;
  button {
    flex: 1;
    border: 0;
    background: transparent;
    padding: 10px 8px;
    border-radius: 3px;
    font-size: 13px;
  }
  button[aria-pressed='true'] {
    background: var(--reader-panel);
    box-shadow: 0 1px 3px #0001;
  }
}
.stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--reader-border);
  border-radius: 4px;
  button {
    border: 0;
    background: none;
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
  output {
    font-size: 13px;
    min-width: 24px;
    text-align: center;
  }
}
.setting-row select {
  border: 1px solid var(--reader-border);
  background: var(--reader-panel);
  color: inherit;
  border-radius: 4px;
  padding: 9px;
  font-size: 13px;
}
.theme-choices {
  display: flex;
  gap: 12px;
  button {
    flex: 1;
    background: none;
    border: 1px solid var(--reader-border);
    padding: 10px;
    border-radius: 4px;
    font-size: 11px;
    > span:first-child {
      display: block;
      height: 36px;
      border-radius: 2px;
      margin-bottom: 9px;
      border: 1px solid #8883;
    }
    &.theme-paper > span:first-child {
      background: #f4e6d6;
    }
    &.theme-light > span:first-child {
      background: #fff;
    }
    &.theme-night > span:first-child {
      background: #252925;
    }
    &[aria-pressed='true'] {
      outline: 1px solid var(--reader-accent);
      border-color: var(--reader-accent);
    }
  }
}
.rule-switch {
  font-size: 13px;
  input {
    width: 18px;
    height: 18px;
    accent-color: var(--reader-accent);
  }
}
.reading-preview {
  font-family: 'carved', serif;
  line-height: 1.9;
  background: var(--reader-border);
  border-radius: 4px;
  padding: 20px;
  overflow-wrap: anywhere;
}
.saved-tabs {
  margin-bottom: 24px;
}
.saved-card {
  border-bottom: 1px solid var(--reader-border);
  padding-bottom: 24px;
  margin-bottom: 24px;
}
.saved-card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  font-size: 11px;
  color: var(--reader-muted);
  button {
    border: 0;
    background: none;
    color: var(--reader-muted);
    font-size: 11px;
    padding: 4px;
  }
}
.saved-quote {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-align: left;
  border: 0;
  border-left: 2px solid var(--reader-accent);
  background: none;
  font-family: serif !important;
  font-size: 16px !important;
  line-height: 1.9;
  margin: 16px 0;
  padding: 0 0 0 12px;
  width: 100%;
  overflow-wrap: anywhere;
}
.note-label {
  display: block;
  font-size: 11px;
  color: var(--reader-muted);
  margin-bottom: 8px;
}
.saved-card textarea {
  width: 100%;
  resize: vertical;
  border: 1px solid var(--reader-border);
  border-radius: 4px;
  background: transparent;
  color: inherit;
  padding: 10px;
  font-size: 12px;
  line-height: 1.8;
}
.saved-card-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  button {
    border: 0;
    background: none;
    font-size: 11px;
    padding: 4px 0;
    color: var(--reader-accent);
  }
}
.storage-error {
  font-size: 12px;
  color: var(--reader-accent);
  line-height: 1.8;
  padding: 12px;
  border: 1px solid var(--reader-border);
}
.selection-toolbar {
  position: fixed;
  bottom: 88px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--reader-panel);
  box-shadow: 0 4px 24px #0003;
  border: 1px solid var(--reader-border);
  padding: 8px 12px;
  border-radius: 6px;
  white-space: nowrap;
  font:
    12px system-ui,
    sans-serif;
  span {
    color: var(--reader-muted);
  }
  button {
    border: 0;
    background: var(--reader-accent);
    color: var(--reader-panel);
    padding: 9px 12px;
    border-radius: 3px;
  }
  button:last-child {
    background: none;
    color: var(--reader-muted);
    font-size: 18px;
    padding: 5px;
  }
}
.reader-toast {
  position: fixed;
  bottom: 92px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1200;
  max-width: 90vw;
  padding: 12px 20px;
  border-radius: 4px;
  background: var(--reader-ink);
  color: var(--reader-panel);
  box-shadow: 0 4px 24px #0002;
  font:
    12px/1.7 system-ui,
    sans-serif;
  text-align: center;
  pointer-events: none;
}
@media (max-width: 800px) {
  .identity-caption {
    display: none;
  }
  .reader-topbar {
    padding: 12px 20px;
  }
  .reader-actions button {
    padding: 10px;
  }
  .reader-bottom-bar {
    padding: 12px 20px;
  }
}
@media (max-width: 560px) {
  .reader-page {
    padding-top: 105px;
    padding-bottom: 94px;
  }
  .reader-topbar {
    padding: 12px 16px 6px;
    gap: 8px;
    flex-wrap: wrap;
  }
  .reader-identity {
    width: 100%;
    gap: 14px;
    h1 {
      font-size: 19px;
    }
  }
  .reader-actions {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
    gap: 0;
    .entry-count {
      font-size: 9px;
    }
  }
  .reader-actions button {
    padding: 9px 6px;
    font-size: 12px;
  }
  .reader-hero {
    min-height: calc(100svh - 192px);
    :deep(.cover) {
      min-height: 240px;
      gap: 12px;
    }
    :deep(.cover .title) {
      height: 150px;
    }
    :deep(.cover .illustration) {
      height: 156px;
    }
  }
  .hero-kicker {
    font-size: 10px;
    margin-top: 12px;
  }
  .reader-bottom-bar {
    padding: 9px 12px 12px;
    flex-wrap: wrap;
    gap: 7px;
  }
  .reading-location {
    width: 100%;
    gap: 10px;
    font-size: 11px;
    .current-chapter {
      max-width: 65vw;
    }
    .reading-percent {
      margin-left: auto;
    }
  }
  .bottom-actions {
    width: 100%;
    justify-content: space-between;
    gap: 6px;
    button {
      padding: 6px 10px;
      font-size: 11px;
    }
  }
  .reader-toast {
    bottom: 110px;
  }
  .selection-toolbar {
    bottom: 104px;
  }
  .identity-divider {
    height: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>
