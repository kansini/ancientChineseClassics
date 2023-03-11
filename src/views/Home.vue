<script setup lang="ts">
import BookSpine from "../components/BookSpine.vue"
import {reactive} from "vue";
import {useRouter} from "vue-router"

const booksData = reactive([
  {
    title: "天工开物",
    author: "宋应星",
    dynasty: "明"
  },
  {
    title: "梦溪笔谈",
    author: "沈阔",
    dynasty: "宋"
  },
  {
    title: "搜神记",
    author: "干宝",
    dynasty: "东晋"
  },
  {
    title: "三十六计",
    author: "张联甲",
    dynasty: "南北朝"
  },
  {
    title: "世说新语",
    author: "刘义庆",
    dynasty: "南朝"
  },
  {
    title: "本草纲目",
    author: "李时珍",
    dynasty: "明"
  },
  {
    title: "水经注",
    author: "郦道元",
    dynasty: "北魏"
  },
  {
    title: "百战奇略",
    author: "无名氏",
    dynasty: "宋"
  },
  {
    title: "菜根谭",
    author: "洪应明",
    dynasty: "明"
  },
  {
    title: "文心雕龙",
    author: "刘勰",
    dynasty: "南朝"
  },
  {
    title: "孙子兵法",
    author: "孙武",
    dynasty: "战国"
  },
])
const router = useRouter()
</script>

<template>
  <div class="home">
    <div class="title"></div>
    <div class="book-shelf">
      <template v-for="book in booksData">
        <book-spine
            :title="book.title"
            :author="book.author"
            :dynasty="book.dynasty"
            @click.native="router.push('about')"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    width: 344px;
    height: 72px;
    margin-bottom: 80px;
    background: url("../assets/img/main_title.svg") no-repeat center;
    background-size: cover;
  }

  .book-shelf {
    display: flex;
    justify-content: center;
    gap: 24px;
  }

}
</style>
