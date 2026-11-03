<script setup lang="ts">
import { ref, nextTick, watchPostEffect, watch, onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import { chapterId, paragraphId, highlightText } from '@/utils/reader'
import type { BookArticle, ReaderSettings } from '@/utils/reader'
const props = defineProps<{
  name: string
  articles: BookArticle[]
  settings: ReaderSettings
  query?: string
  bookmarked?: string[]
}>()
const emit = defineEmits<{ (event: 'ready'): void }>()
const volumes = ref<HTMLElement[]>([])
function layoutVolume(volume: HTMLElement) {
  const content = volume.querySelector<HTMLElement>('.vol-content')
  if (!content) return
  if (props.settings.direction === 'horizontal') {
    content.style.width = ''
    volume.style.height = ''
    return
  }
  const columnWidth = parseFloat(getComputedStyle(volume).getPropertyValue('--column-width'))
  const columns = Math.max(1, Math.floor(volume.clientWidth / columnWidth))
  content.style.width = `${columns * columnWidth}px`
  volume.style.height = `${content.scrollHeight}px`
}
async function relayout() {
  await nextTick()
  volumes.value.forEach(layoutVolume)
}
watchPostEffect((onCleanup) => {
  const observer = new ResizeObserver((entries) =>
    entries.forEach((entry) => layoutVolume(entry.target as HTMLElement)),
  )
  volumes.value.forEach((volume) => observer.observe(volume))
  onCleanup(() => observer.disconnect())
})
watch(
  () => [
    props.settings.fontSize,
    props.settings.columnWidth,
    props.settings.direction,
    props.query,
  ],
  relayout,
  { flush: 'post' },
)
useEventListener(document.fonts, 'loadingdone', relayout)
onMounted(async () => {
  await document.fonts.ready
  await relayout()
  emit('ready')
})
defineExpose({ relayout })
</script>
<template>
  <section
    v-for="(article, index) in articles"
    :key="chapterId(name, index)"
    class="article item"
    :class="{ horizontal: settings.direction === 'horizontal', 'no-rules': !settings.rules }"
    :id="chapterId(name, index)"
    :data-chapter="index"
  >
    <h2
      class="title"
      :style="{ '--title-characters': Math.max(1, article.title.length) }"
      :title="article.title"
    >
      <span class="title-item">{{ name }}</span
      ><span class="title-item">{{ article.title }}</span>
    </h2>
    <div class="vol" ref="volumes">
      <div class="vol-content">
        <p
          v-for="(text, paragraph) in article.content"
          :key="paragraph"
          class="graph"
          :class="{ 'has-bookmark': bookmarked?.includes(`${index}:${paragraph}`) }"
          :id="paragraphId(name, index, paragraph)"
          :data-chapter="index"
          :data-paragraph="paragraph"
        >
          <template v-for="(part, partIndex) in highlightText(text, query || '')" :key="partIndex"
            ><mark v-if="part.match">{{ part.text }}</mark
            ><template v-else>{{ part.text }}</template></template
          >
        </p>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.article {
  --row-height: 480px;
  font-family: 'carved', serif;
  padding: 8px 24px 32px;
  display: flex;
  flex-direction: row-reverse;
  color: var(--reader-ink, #251716);
  scroll-margin-top: 100px;
  .title {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex: 0 0 64px;
    height: var(--row-height);
    background: var(--reader-seal, #73000e);
    color: #fff;
    font-size: 26px;
    font-weight: 400;
    text-align: center;
    margin: 0;
    &::before,
    &::after {
      display: block;
      content: '';
      width: 64px;
      flex-shrink: 0;
    }
    &::before {
      height: 24px;
      border-bottom: 4px solid var(--reader-panel, #fffbee);
    }
    &::after {
      height: 40px;
      border-top: 4px solid var(--reader-panel, #fffbee);
    }
    .title-item {
      width: 28px;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }
    .title-item:first-child {
      font-size: 22px;
    }
    .title-item:last-child {
      font-size: min(26px, calc(var(--title-budget, 280px) / var(--title-characters) / 1.25));
    }
  }
  .vol {
    flex: 1;
    min-width: 0;
    height: var(--row-height);
    background-image: linear-gradient(
      to right,
      var(--reader-rule, rgba(0, 0, 0, 0.3)) 1px,
      transparent 1px
    );
    background-size: var(--column-width, 64px) 1px;
    background-position: right top;
    .vol-content {
      margin-left: auto;
      font-size: var(--reader-font-size, 22px);
      writing-mode: vertical-rl;
      line-height: var(--column-width, 64px);
      height: var(--row-height);
      column-width: var(--row-height);
      column-gap: 24px;
      column-fill: auto;
      overflow-wrap: anywhere;
    }
  }
  .graph {
    margin: 0;
    orphans: 1;
    widows: 1;
    scroll-margin-top: 100px;
  }
  .graph.has-bookmark {
    text-decoration: underline;
    text-decoration-color: var(--reader-accent, #a54032);
    text-decoration-style: dotted;
    text-underline-offset: 6px;
  }
  mark {
    background: var(--reader-highlight, #efd58a);
    color: inherit;
    border-radius: 2px;
  }
  &.no-rules .vol {
    background-image: none;
  }
  &.horizontal {
    display: block;
    max-width: 1260px;
    margin: 0 auto;
    padding: 20px 36px 60px;
    .title {
      height: auto;
      min-height: 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      gap: 16px;
      background: none;
      color: var(--reader-ink);
      border-bottom: 1px solid var(--reader-border);
      padding: 0 0 18px;
      margin-bottom: 24px;
      font-family: serif;
      font-size: 24px;
      &::before,
      &::after {
        display: none;
      }
      .title-item {
        width: auto;
        line-height: 1.5;
      }
      .title-item:first-child {
        font-size: 13px;
        color: var(--reader-muted);
      }
      .title-item:last-child {
        font-size: 24px;
      }
    }
    .vol {
      height: auto;
      background: none;
      .vol-content {
        height: auto;
        width: auto;
        writing-mode: horizontal-tb;
        columns: auto;
        line-height: 2.1;
      }
    }
    .graph {
      margin-bottom: 1.5em;
      text-indent: 2em;
      overflow-wrap: anywhere;
    }
  }
}
@media (max-width: 600px) {
  .article {
    padding: 8px 16px 28px;
    --row-height: 420px;
    .title {
      --title-budget: 230px;
      flex-basis: 48px;
      font-size: 22px;
      &::before,
      &::after {
        width: 48px;
      }
    }
    &.horizontal {
      padding: 20px 22px 36px;
    }
    .vol .vol-content {
      column-gap: 24px;
    }
  }
}
</style>
