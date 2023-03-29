<script setup lang="ts">
import {ref} from "vue";
import {getBooksData} from "@/api/getBooksData";
import {toPinyin} from '@/utils/toPinyin';


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
  name: "山海经"
})

const booksData = ref<IBooksData>({
  name: '',
  description: '',
  articles: []
})
getBooksData(props.name).then((res) => booksData.value = res.data)


</script>

<template>
  <div v-for="article in booksData.articles" class="article item">
    <div class="title" :id="toPinyin(article.title)">
      <div class="title-item">{{ name }}</div>
      <div class="title-item">{{ article.title }}</div>
    </div>
    <div class="vol">
      <div class="graph" v-for="p in article.content">
        {{ p }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.article {
  font-family: "carved";
  padding: 8px 16px;
  display: flex;
  flex-direction: row-reverse;

  .title {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 480px;
    background: #73000e;
    color: #fff;
    font-size: 24px;
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
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    background-image: linear-gradient(to right, rgba(0, 0, 0, .4) 1px, transparent 1px);
    background-size: 48px;

    .graph {
      font-size: 20px;
      writing-mode: vertical-rl;
      line-height: 48px;
      height: 480px;
      margin-bottom: 16px;
    }
  }

}
</style>
