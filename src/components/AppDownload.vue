<script setup lang="ts">
import appGalleryIcon from '@/assets/img/app_gallery.svg'

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
    class="app-download-button is-compact"
    :class="{ 'is-inverse': inverse }"
    :href="appGalleryUrl"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="downloadLabel"
  >
    <img class="app-download-icon" :src="appGalleryIcon" alt="" width="44" height="44" />
    <span class="app-download-label"><small>下载</small><strong>AppGallery</strong></span>
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
      <img class="app-download-icon" :src="appGalleryIcon" alt="" width="44" height="44" />
      <span class="app-download-label"><small>下载</small><strong>AppGallery</strong></span>
    </a>
  </section>
</template>

<style scoped lang="scss">
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
  box-sizing: border-box;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 1.2em;
  width: 23em;
  height: 7.2em;
  padding: 1.2em 1.3em;
  border: 0.2em solid #000;
  border-radius: 1.8em;
  background: #fff;
  color: #000;
  font-family: Arial, "Helvetica Neue", sans-serif;
  font-size: 10px;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    background: #f5f5f5;
  }
  &.is-compact {
    font-size: 7px;
  }
}
.app-download-icon {
  display: block;
  flex-shrink: 0;
  width: 4.4em;
  height: 4.4em;
}
.app-download-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2em;
  small {
    font-family: system-ui, sans-serif;
    font-size: 1.3em;
    font-weight: 500;
    line-height: 1.2;
  }
  strong {
    font-size: 2.4em;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.03em;
  }
}
a:focus-visible {
  outline: 2px solid #934334;
  outline-offset: 4px;
  &.is-inverse {
    outline-color: #f8f3e7;
  }
}
@media (max-width: 600px) {
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
}
</style>
