<script setup lang="ts">
import BookShelf from '@/components/BookShelf.vue'
import AppDownload from '@/components/AppDownload.vue'
import { useReader } from '@/stores/reader'
import { readerLink } from '@/utils/reader'
const reader = useReader()
</script>
<template>
  <main class="library-page">
    <header class="library-header">
      <RouterLink to="/" class="library-brand"
        ><img src="/src/assets/img/main_title.svg" alt="中国典籍"
      /></RouterLink>
      <div class="library-header-actions">
        <span class="library-tagline">一方书案，万卷古今。</span>
        <AppDownload compact />
      </div>
    </header>
    <section v-if="reader.recent.length" class="recent-reading" aria-labelledby="continue-heading">
      <div class="library-section-title">
        <div>
          <p>拾起上次的那一页</p>
          <h1 id="continue-heading">继续阅读</h1>
        </div>
        <span>阅读记录保存在本机</span>
      </div>
      <div class="recent-grid">
        <RouterLink
          v-for="progress in reader.recent.slice(0, 3)"
          :key="progress.book"
          :to="readerLink(progress.book, progress)"
          class="continue-card"
          ><div class="continue-card-top">
            <h2>{{ progress.book }}</h2>
            <span>{{ progress.percentage }}%</span>
          </div>
          <p class="continue-chapter">{{ progress.chapterTitle }}</p>
          <p class="continue-excerpt">{{ progress.excerpt || '接着上次的思绪，继续读下去。' }}</p>
          <div class="continue-card-bottom">
            <span>接着读 <span aria-hidden="true">↗</span></span>
            <div class="card-progress">
              <i :style="{ width: `${progress.percentage}%` }" />
            </div></div
        ></RouterLink>
      </div>
    </section>
    <section class="library-books" aria-labelledby="library-heading">
      <div class="library-section-title">
        <div>
          <p>经史之间，自有天地</p>
          <h2 id="library-heading">案上群书</h2>
        </div>
        <span>择一卷 · 慢慢读</span>
      </div>
      <BookShelf />
    </section>
    <AppDownload />
    <footer class="library-footer">
      <span>中国典籍</span>
      <p>书中日月长，案上岁时静。</p>
    </footer>
  </main>
</template>
<style scoped lang="scss">
.library-page {
  min-height: 100svh;
  padding: 0 48px;
  color: #30261f;
}
.library-header {

  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 36px 0;
  border-bottom: 1px solid #9c7f5944;
}
.library-brand img {
  display: block;
  width: 190px;
  height: auto;
}
.library-header-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}
.library-tagline {
  font:
    12px system-ui,
    sans-serif;
  letter-spacing: 3px;
  color: #806e56;
}
.recent-reading,
.library-books {

  margin: 0 auto;
  padding-top: 48px;
}
.library-section-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 28px;
  p {
    font:
      10px system-ui,
      sans-serif;
    color: #806e56;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }
  h1,
  h2 {
    font-family: serif;
    font-weight: 400;
    font-size: 27px;
    letter-spacing: 3px;
  }
  > span {
    font:
      11px system-ui,
      sans-serif;
    color: #806e56;
  }
}
.recent-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.continue-card {
  display: block;
  color: inherit;
  padding: 22px 24px;
  background: #fff9efbb;
  border: 1px solid #cbb79b;
  border-top: 2px solid #934334;
  transition:
    background 0.2s,
    transform 0.2s;
  &:hover {
    background: #fff9ef;
    transform: translateY(-2px);
  }
  &:focus-visible {
    outline: 2px solid #934334;
    outline-offset: 4px;
  }
}
.continue-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    font-family: serif;
    font-size: 22px;
    font-weight: 400;
  }
  span {
    font:
      11px system-ui,
      sans-serif;
    color: #806e56;
  }
}
.continue-chapter {
  font:
    11px system-ui,
    sans-serif;
  color: #934334;
  margin: 10px 0 16px;
}
.continue-excerpt {
  font-family: serif;
  font-size: 14px;
  line-height: 1.9;
  color: #6d5e4e;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  min-height: 54px;
  overflow-wrap: anywhere;
}
.continue-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  font:
    11px system-ui,
    sans-serif;
  color: #934334;
  > span {
    white-space: nowrap;
  }
}
.card-progress {
  height: 2px;
  background: #ddcfbb;
  flex: 1;
  max-width: 100px;
  i {
    display: block;
    height: 100%;
    background: #934334;
  }
}
.library-books {
  padding-bottom: 64px;
}
.library-books :deep(.book-shelf) {
  justify-content: flex-start;
  padding: 12px 0;
}
.library-footer {

  margin: 0 auto;
  border-top: 1px solid #9c7f5944;
  padding: 24px 0 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #806e56;
  p {
    font:
      11px system-ui,
      sans-serif;
  }
}
@media (max-width: 900px) {
  .recent-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .recent-grid > a:last-child:nth-child(3) {
    display: none;
  }
  .library-page {
    padding: 0 28px;
  }
  .library-tagline {
    letter-spacing: 1px;
  }
}
@media (max-width: 560px) {
  .library-page {
    padding: 0 20px;
  }
  .library-header {
    padding: 28px 0;
    gap: 12px;
  }
  .library-brand img {
    width: 152px;
  }
  .library-tagline {
    display: none;
  }
  .recent-reading,
  .library-books {
    padding-top: 32px;
  }
  .recent-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .library-section-title {
    margin-bottom: 24px;
    h1,
    h2 {
      font-size: 24px;
    }
    > span {
      font-size: 10px;
    }
  }
  .continue-card {
    padding: 20px;
  }
  .library-books :deep(.book-shelf) {
    gap: 24px 18px;
    justify-content: space-between;
  }
  .library-footer {
    font-size: 12px;
    p {
      font-size: 10px;
    }
  }
}
</style>
