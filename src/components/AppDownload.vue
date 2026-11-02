<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean; inverse?: boolean }>(), {
  compact: false,
  inverse: false,
})

const appGalleryUrl = 'https://appgallery.huawei.com/app/detail?id=C6917606735082084142'
const downloadLabel = '前往华为应用市场下载中国典籍 HarmonyOS App（新窗口打开）'
</script>

<template>
  <a
    v-if="compact"
    class="app-download-link"
    :class="{ 'is-inverse': inverse }"
    :href="appGalleryUrl"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="downloadLabel"
  >
    下载鸿蒙 App <span aria-hidden="true">↗</span>
  </a>
  <section v-else class="app-download" aria-labelledby="app-download-heading">
    <div class="app-download-copy">
      <p class="app-download-eyebrow">中国典籍 · HarmonyOS</p>
      <h2 id="app-download-heading">把古籍，带在身边。</h2>
      <p class="app-download-description">中国典籍现已提供鸿蒙 App，前往华为应用市场查看并下载。</p>
    </div>
    <a
      class="app-download-button"
      :href="appGalleryUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="downloadLabel"
    >
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
        <rect x="3" y="1.5" width="14" height="21" rx="2" stroke="currentColor" />
        <path d="M8 4h4M8 20h4" stroke="currentColor" stroke-linecap="round" />
      </svg>
      <span>前往华为应用市场<small>下载 HarmonyOS App</small></span>
      <span class="app-download-arrow" aria-hidden="true">↗</span>
    </a>
  </section>
</template>

<style scoped lang="scss">
.app-download-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid #b29a7b;
  border-radius: 3px;
  color: #7c3b30;
  background: #fff9ef99;
  font:
    12px system-ui,
    sans-serif;
  white-space: nowrap;
  &:hover {
    background: #fff9ef;
    border-color: #934334;
  }
  &.is-inverse {
    color: #f8f3e7;
    border-color: #f8f3e755;
    background: #ffffff0a;
    &:hover {
      background: #ffffff18;
    }
  }
}
.app-download {
  max-width: 1240px;
  margin: 0 auto 48px;
  padding: 32px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  border: 1px solid #cbb79b;
  background: #fff9efbb;
  color: #30261f;
}
.app-download-eyebrow {
  color: #806e56;
  font:
    11px system-ui,
    sans-serif;
  letter-spacing: 2px;
  margin-bottom: 12px;
}
.app-download h2 {
  font-family: serif;
  font-size: 26px;
  font-weight: 400;
  letter-spacing: 2px;
}
.app-download-description {
  margin-top: 12px;
  color: #806e56;
  font:
    12px/1.9 system-ui,
    sans-serif;
}
.app-download-button {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 15px 20px;
  background: #934334;
  color: #fff9ef;
  border-radius: 3px;
  font:
    14px system-ui,
    sans-serif;
  &:hover {
    background: #79352a;
  }
  small {
    display: block;
    font-size: 10px;
    margin-top: 5px;
    opacity: 0.8;
  }
}
.app-download-arrow {
  margin-left: 12px;
}
a:focus-visible {
  outline: 2px solid #934334;
  outline-offset: 4px;
  &.is-inverse {
    outline-color: #f8f3e7;
  }
}
@media (max-width: 600px) {
  .app-download-link {
    padding: 9px 10px;
    gap: 7px;
    font-size: 11px;
  }
  .app-download {
    flex-direction: column;
    align-items: stretch;
    padding: 24px;
    gap: 24px;
    margin-bottom: 32px;
  }
  .app-download h2 {
    font-size: 22px;
    letter-spacing: 0;
  }
  .app-download-button {
    width: 100%;
  }
}
</style>
