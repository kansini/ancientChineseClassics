const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { runInNewContext } = require('node:vm')
const ts = require('typescript')

function fixture(cached = false) {
  let image, deadline
  const exports = {}
  class Image {
    constructor() { image = this; this.complete = cached }
    set src(value) {
      this.url = value
      assert.equal(typeof this.onload, 'function')
      assert.equal(typeof this.onerror, 'function')
    }
  }
  const source = ts.transpileModule(readFileSync('src/utils/preloadImage.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText
  runInNewContext(source, {
    exports, Image,
    setTimeout(fn) { deadline = fn; return 1 },
    clearTimeout() {},
  })
  return { load: exports.preloadImage, image: () => image, timeout: () => deadline() }
}

test('cached image resolves with handlers installed before requesting it', async () => {
  const f = fixture(true)
  await f.load('/assets/background-hash.jpg')
  assert.equal(f.image().onload, null)
})
test('image failure still allows entry', async () => {
  const f = fixture()
  const done = f.load('/missing.jpg')
  f.image().onerror()
  await done
  assert.equal(f.image().onerror, null)
})
test('stalled connection cannot keep the landing screen blocked', async () => {
  const f = fixture()
  const done = f.load('/stalled.jpg')
  f.timeout()
  await done
  assert.equal(f.image().onload, null)
})
test('successful preload settles safely before its deadline', async () => {
  const f = fixture()
  const done = f.load('/background.jpg')
  f.image().onload()
  await done
  f.timeout()
})
