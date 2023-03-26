<script lang="ts" setup>
import {ref} from "vue";
import {getBooksData} from "@/api/getBooksData";

interface IIntro {
  name?: string
  author?: string
  dynasty?: string
  description?: Array<string>
}

interface IProps {
  name: string
}

const introData = ref<IIntro>({
  name: '',
  author: '',
  dynasty: '',
  description: []
})
const props = withDefaults(defineProps<IProps>(), {
  name: "山海经"
})
getBooksData(props.name).then((res) => introData.value = res.data)
</script>
<template>
  <div class="acc-intro">
    <div class="acc-intro-header">
      <p>{{ introData.name }}</p>
      <p>
        {{ introData.author }}
        <span>【{{ introData.dynasty }}】</span>
      </p>
    </div>
    <div class="acc-intro-content">
      <p v-for="p in introData.description">
        {{ p }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.acc-intro {
  cursor: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  height: 100%;

  .acc-intro-header {
    padding: 16px 0;
    text-align: center;

    p:nth-child(1) {
      font-size: 32px;
      margin-bottom: 8px;
    }
  }

  .acc-intro-content {
    text-indent: 2em;
    line-height: 40px;
    width: 960px;
    max-height: calc(100vh - 128px);
    overflow-y: auto;
  }
}
</style>