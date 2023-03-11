<script setup lang="ts">
import {ref} from "vue"
import {getBooksData} from "@/api/getBooksData";
import {NUM} from "@/utils/num"

interface IBooksData {
  name: string
  description: string
  articles: Array<IArticlesData>
}

interface IArticlesData {
  title: string
  content: Array<string>
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

const getVolNum = (index: number) => {
  if (index > 0 && index < 7) {
    return "上篇"
  } else if (index > 6 && index < 14) {
    return "中篇"
  } else {
    return "下篇"
  }
}
</script>

<template>
  <div v-for="(article,index) in booksData.articles" class="article">
    <div class="title">
            <div class="title-item">{{ props.name }}</div>
      <div class="title-item" v-if="index >0">
        {{ getVolNum(index) }}
      </div>
      <div class="title-item" v-if="index > 0">{{ NUM[index] }}</div>
      <div class="title-item">{{ article.title }}</div>
    </div>
    <div class="vol">
      <div class="graph" v-for="(p,i) in article.content">
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
