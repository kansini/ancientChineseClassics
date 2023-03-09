<script setup lang="ts">
import {ref, reactive} from "vue"
import {getBooksData} from "@/api/getBooksData";

interface IBooksData {
  name: string
  description: string
  articles: Array<IArticlesData>
}

interface IArticlesData {
  title: string
  content: Array<string>
}

const props = defineProps({
  name: {
    type: String,
    default: '山海经'
  },
  text: {
    type: String,
    default: 'click'
  },
  color: {
    type: String,
    default: 'rgba(255,0,0,.8)'
  }
})

const booksData = ref<IBooksData>({
  name: '',
  description: '',
  articles: []
})
getBooksData(props.name).then((res) => booksData.value = res.data)

</script>

<template>
  <h1>{{ booksData.name }}</h1>
  <h5>{{ booksData.description }}</h5>
  <br>
  <div v-for="(article,index) in booksData.articles" style="padding: 8px 0">
    <h4>{{ index + 1 }}{{ article.title }}</h4>
    <p v-for="p in article.content">
      {{ p }}
    </p>
  </div>
</template>
