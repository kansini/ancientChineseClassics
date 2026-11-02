import { PINYIN } from '@/enum/pinyin'

export interface BookArticle {
  title: string
  content: string[]
}
export interface BookData {
  name: string
  author?: string
  dynasty?: string
  description: string[]
  articles: BookArticle[]
}
export interface ReadingLocation {
  chapter: number
  paragraph: number
  offset: number
}
export interface ReadingProgress extends ReadingLocation {
  book: string
  chapterTitle: string
  excerpt: string
  percentage: number
  updatedAt: number
}
export interface ReaderSettings {
  fontSize: number
  columnWidth: number
  direction: 'vertical' | 'horizontal'
  theme: 'paper' | 'light' | 'night'
  rules: boolean
}
export interface ReaderEntry extends ReadingLocation {
  id: string
  book: string
  chapterTitle: string
  text: string
  note: string
  type: 'bookmark' | 'excerpt'
  createdAt: number
}
export const defaultSettings: ReaderSettings = {
  fontSize: 22,
  columnWidth: 64,
  direction: 'vertical',
  theme: 'paper',
  rules: true,
}
export const bookSlug = (name: string): string => (PINYIN as Record<string, string>)[name] || ''
export const bookFromSlug = (slug: string): string =>
  Object.keys(PINYIN).find((name) => bookSlug(name) === slug) || ''
export const chapterId = (name: string, chapter: number) => `${bookSlug(name)}${chapter}`
export const paragraphId = (name: string, chapter: number, paragraph: number) =>
  `${bookSlug(name)}-c${chapter + 1}-p${paragraph + 1}`
export const readerLink = (name: string, location?: Partial<ReadingLocation>) => {
  const base = `/book/${bookSlug(name)}`
  if (location?.chapter === undefined) return base
  return `${base}/${location.chapter + 1}${location.paragraph === undefined ? '' : `#p-${location.paragraph + 1}${location.offset ? `-o-${location.offset}` : ''}`}`
}
export const parseAnchor = (hash: string): Pick<ReadingLocation, 'paragraph' | 'offset'> => {
  const match = /^#p-(\d+)(?:-o-(\d+))?$/.exec(hash)
  return {
    paragraph: match ? Math.max(0, Number(match[1]) - 1) : 0,
    offset: match ? Number(match[2] || 0) : 0,
  }
}
export function highlightText(text: string, query: string) {
  if (!query.trim()) return [{ text, match: false }]
  const result: { text: string; match: boolean }[] = []
  const lower = text.toLocaleLowerCase(),
    needle = query.trim().toLocaleLowerCase()
  let start = 0,
    index = lower.indexOf(needle)
  while (index !== -1) {
    if (index > start) result.push({ text: text.slice(start, index), match: false })
    result.push({ text: text.slice(index, index + needle.length), match: true })
    start = index + needle.length
    index = lower.indexOf(needle, start)
  }
  if (start < text.length) result.push({ text: text.slice(start), match: false })
  return result
}
export function searchBook(articles: BookArticle[], query: string) {
  const needle = query.trim().toLocaleLowerCase()
  const results: {
    chapter: number
    paragraph: number
    offset: number
    title: string
    snippet: string
  }[] = []
  let total = 0
  if (!needle) return { results, total }
  articles.forEach((article, chapter) =>
    article.content.forEach((text, paragraph) => {
      const offset = text.toLocaleLowerCase().indexOf(needle)
      if (offset < 0) return
      total++
      if (results.length >= 100) return
      const start = Math.max(0, offset - 24),
        end = Math.min(text.length, offset + needle.length + 48)
      results.push({
        chapter,
        paragraph,
        offset,
        title: article.title,
        snippet: `${start ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`,
      })
    }),
  )
  return { results, total }
}
// Text nodes may be split by search highlights; offsets stay relative to the original paragraph.
export function rangeAtOffset(element: HTMLElement, offset: number): Range | null {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let remaining = Math.max(0, offset),
    node: Node | null
  let last: Node | null = null
  while ((node = walker.nextNode())) {
    last = node
    const length = node.textContent?.length || 0
    if (remaining < length) {
      const range = document.createRange()
      range.setStart(node, remaining)
      range.setEnd(node, Math.min(length, remaining + 1))
      return range
    }
    remaining -= length
  }
  if (!last) return null
  const range = document.createRange()
  const length = last.textContent?.length || 0
  range.setStart(last, Math.max(0, length - 1))
  range.setEnd(last, length)
  return range
}
