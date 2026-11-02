const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { runInNewContext } = require('node:vm')
const ts = require('typescript')
function loadSource(path, dependencies = {}, globals = {}) {
  const exports = {}
  const source = ts.transpileModule(readFileSync(resolve(__dirname, '..', path), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  runInNewContext(source, {
    ...globals,
    exports,
    require: (name) => {
      assert.ok(dependencies[name], `Unexpected dependency: ${name}`)
      return dependencies[name]
    },
  })
  return exports
}
const reader = loadSource('src/utils/reader.ts', {
  '@/enum/pinyin': loadSource('src/enum/pinyin.ts'),
})
const plain = (value) => JSON.parse(JSON.stringify(value))
test('book routes round-trip every supported book without transient page state', () => {
  for (const book of ['菜根谭', '三国志', '水经注', '山海经', '梦溪笔谈']) {
    const slug = reader.bookSlug(book)
    assert.equal(reader.bookFromSlug(slug), book)
    assert.equal(
      reader.readerLink(book, { chapter: 2, paragraph: 8, offset: 13 }),
      `/book/${slug}/3#p-9-o-13`,
    )
  }
  assert.equal(reader.bookFromSlug('../unknown'), '')
})
test('paragraph anchors use one-based URLs and safe zero-based locations', () => {
  assert.deepEqual(plain(reader.parseAnchor('#p-9-o-13')), { paragraph: 8, offset: 13 })
  assert.deepEqual(plain(reader.parseAnchor('#p-1')), { paragraph: 0, offset: 0 })
  assert.deepEqual(plain(reader.parseAnchor('#invalid')), { paragraph: 0, offset: 0 })
})
test('search returns exact original offsets and limits rendering while counting all paragraphs', () => {
  const articles = [{ title: '修身', content: ['天地之间，自有天地。', '没有匹配', 'ABC 天地'] }]
  const found = reader.searchBook(articles, ' 天地 ')
  assert.equal(found.total, 2)
  assert.deepEqual(
    plain(found.results.map(({ chapter, paragraph, offset }) => ({ chapter, paragraph, offset }))),
    [
      { chapter: 0, paragraph: 0, offset: 0 },
      { chapter: 0, paragraph: 2, offset: 4 },
    ],
  )
  assert.equal(reader.searchBook(articles, 'abc').results[0].offset, 0)
  assert.equal(reader.searchBook(articles, ' ').total, 0)
  const capped = reader.searchBook([{ title: '长卷', content: Array(125).fill('天地') }], '天地')
  assert.equal(capped.total, 125)
  assert.equal(capped.results.length, 100)
})
test('highlighting preserves literal text, punctuation and HTML-shaped search input', () => {
  for (const [text, query] of [
    ['天地，天地。', '天地'],
    ['<script>天地</script>', '<script>'],
    ['a.*b A.*B', '.*'],
    ['ABC abc', 'abc'],
    ['𠀀天地', '天地'],
  ]) {
    const parts = reader.highlightText(text, query)
    assert.equal(parts.map((part) => part.text).join(''), text)
    assert.ok(parts.some((part) => part.match))
  }
  assert.deepEqual(plain(reader.highlightText('原文', '不匹配')), [{ text: '原文', match: false }])
})

function createReader(saved = null, blocked = false) {
  let value = saved
  const storage = {
    getItem: () => value,
    setItem: (_, next) => {
      if (blocked) throw new Error('Storage unavailable')
      value = next
    },
  }
  const pinia = require('pinia')
  pinia.setActivePinia(pinia.createPinia())
  const module = loadSource(
    'src/stores/reader.ts',
    {
      vue: require('vue'),
      pinia,
      '@/utils/reader': reader,
    },
    { localStorage: storage, crypto: { randomUUID: () => 'entry-1' } },
  )
  return { store: module.useReader(), saved: () => value }
}
test('invalid local records and unsupported settings fall back safely', () => {
  const { store } = createReader(
    JSON.stringify({
      settings: { fontSize: 999, theme: 'unknown' },
      entries: [{ id: 'bad' }],
      progress: { bad: { book: 'unknown' } },
    }),
  )
  assert.equal(store.settings.fontSize, 22)
  assert.equal(store.settings.theme, 'paper')
  assert.equal(store.entries.length, 0)
  assert.equal(store.recent.length, 0)
  assert.equal(createReader('not json').store.settings.direction, 'vertical')
})
test('progress, bookmarks and notes persist and duplicate bookmarks are avoided', () => {
  const { store, saved } = createReader()
  const location = { book: '菜根谭', chapter: 1, paragraph: 2, offset: 8, chapterTitle: '应酬' }
  store.recordProgress({ ...location, excerpt: '原文', percentage: 10, updatedAt: 123 })
  const entry = { ...location, text: '值得重读的原文', type: 'bookmark' }
  store.addEntry(entry)
  store.addEntry(entry)
  assert.equal(store.entries.length, 1)
  store.entries[0].note = '自己的批注'
  store.settings.direction = 'horizontal'
  const restored = createReader(saved()).store
  assert.equal(restored.entries[0].note, '自己的批注')
  assert.equal(restored.settings.direction, 'horizontal')
  assert.equal(restored.progress['菜根谭'].offset, 8)
  restored.removeEntry(restored.entries[0].id)
  assert.equal(restored.entries.length, 0)
})
test('unwritable storage reports failure while keeping the reader usable', () => {
  const { store } = createReader(null, true)
  store.settings.fontSize = 24
  assert.equal(store.settings.fontSize, 24)
  assert.match(store.storageError, /未能保存/)
})
