<script lang="ts" setup>
import {useRouter} from 'vue-router';
import {ref} from 'vue';
import {getBooksData} from "../api/getBooksData"
import type {IContents} from "../interface"

const $router = useRouter()
const bookNames = ref<string[]>(
    []
)


getBooksData('contents').then((res) => {
  bookNames.value = res.data.map((item: IContents) => {
    return item.title
  })
})
</script>
<template>
  <loading @enter="$router.push('home')"/>
  <div class="img-preload">
    <template v-for="name in bookNames">
      <img :src="`./assets/bookTitle/title_${name}.svg`">
    </template>
  </div>
</template>

<style lang="scss" scoped>

.img-preload {
  display: none;
}

</style>