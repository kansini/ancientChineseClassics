<script setup lang="ts">
import {ref, onMounted, nextTick, watchPostEffect} from "vue";
import {useEventListener} from "@vueuse/core";
import {getBooksData} from "@/api/getBooksData";
import {PINYIN} from "@/enum/pinyin";
import {setLS, getLS} from "@/utils/ls";


interface IBooksData {
  name: string
  description: string
  articles: IArticlesData[]
}

interface IArticlesData {
  title: string
  content: string[]
}

interface IProps {
  name: string
}

const props = withDefaults(defineProps<IProps>(), {
  name: ""
})

const booksData = ref<IBooksData>({
  name: '',
  description: '',
  articles: []
})
const pinyin: Record<string, string> = PINYIN
const bookName = pinyin[props.name]
const getData = () => {
  if (getLS(bookName)) {
    booksData.value = getLS(bookName)
  } else {
    getBooksData(props.name).then(async (res) => {
      await nextTick()
      setLS(bookName, res.data)
      booksData.value = res.data
    })
  }
}
const getId = (index: number) => {
  return `${bookName}${index}`
}

const volumes = ref<HTMLElement[]>([])
const layoutVolume = (volume: HTMLElement) => {
  const content = volume.querySelector<HTMLElement>('.vol-content')
  if (!content) return

  const columnWidth = parseFloat(getComputedStyle(volume).getPropertyValue('--column-width'))
  // Keep every row on the same right-aligned grid, including fractional viewport widths.
  const columns = Math.max(1, Math.floor(volume.clientWidth / columnWidth))
  content.style.width = `${columns * columnWidth}px`
  // In vertical writing mode, overflow multicolumn boxes continue below the first row.
  // Reserve their full height so later articles cannot overlap them.
  volume.style.height = `${content.scrollHeight}px`
}
const layoutVolumes = () => volumes.value.forEach(layoutVolume)

watchPostEffect(onCleanup => {
  const observer = new ResizeObserver(entries => {
    entries.forEach(entry => layoutVolume(entry.target as HTMLElement))
  })
  volumes.value.forEach(volume => observer.observe(volume))
  onCleanup(() => observer.disconnect())
})
useEventListener(document.fonts, 'loadingdone', layoutVolumes)

onMounted(async () => {
  await nextTick()
  getData()
  await document.fonts.ready
  layoutVolumes()
})

</script>

<template>
  <div
      v-for="(article,index) in booksData.articles"
      :key="getId(index)"
      class="article item"
      :id="getId(index)"
  >
    <div class="title">
      <div class="title-item">{{ name }}</div>
      <div class="title-item">{{ article.title }}</div>
    </div>
    <div class="vol" ref="volumes">
      <div class="vol-content">
        <p class="graph" v-for="(p, paragraphIndex) in article.content" :key="paragraphIndex">
          {{ p }}
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.article {
  --column-width: 64px;
  --row-height: 480px;
  font-family: "carved",serif;
  padding: 8px 16px;
  display: flex;
  flex-direction: row-reverse;

  .title {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    flex: 0 0 64px;
    height: var(--row-height);
    background: #73000e;
    color: #fff;
    font-size: 26px;
    text-align: center;
    mix-blend-mode: color-burn;

    &::before, &::after {
      display: block;
      content: "";
      width: 64px;
    }

    &::before {
      height: 24px;
      border-bottom: 4px solid #fff;
    }

    &::after {
      height: 40px;
      border-top: 4px solid #fff;
    }

    .title-item {
      width: 24px;
    }

  }

  .vol {
    flex: 1;
    min-width: 0;
    height: var(--row-height);
    background-image: linear-gradient(to right, rgba(0, 0, 0, .4) 1px, transparent 1px);
    background-size: var(--column-width) 1px;
    background-position: right top;

    .vol-content {
      margin-left: auto;
      font-size: 22px;
      writing-mode: vertical-rl;
      line-height: var(--column-width);
      height: var(--row-height);
      column-width: var(--row-height);
      column-gap: 16px;
      column-fill: auto;
      overflow-wrap: anywhere;
    }

    .graph {
      margin: 0;
      orphans: 1;
      widows: 1;
    }
  }

}
</style>
