import { getBooksData } from '@/api/getBooksData'
import { bookSlug } from '@/utils/reader'
import type { BookData } from '@/utils/reader'
export async function loadBook(name: string): Promise<BookData> {
  const key = bookSlug(name)
  try {
    const cached = JSON.parse(localStorage.getItem(key) || 'null')
    if (cached?.name === name && Array.isArray(cached.articles)) return cached
  } catch {
    /* Fetch again when the cache is unavailable or malformed. */
  }
  const { data } = await getBooksData(name)
  if (!data || !Array.isArray(data.articles)) throw new Error('书籍数据格式不正确')
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    /* Reading works without a cache. */
  }
  return data
}
