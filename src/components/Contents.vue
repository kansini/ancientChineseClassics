<script lang="ts" setup>
import {ref} from "vue";
import {getBooksData} from "@/api/getBooksData";
import {toPinyin} from '@/utils/toPinyin';

const emits = defineEmits(['click'])

interface IContentsItem {
  title: string
}

interface IProps {
  name: string
}

const contentsData = ref<IContentsItem[]>([])
const props = withDefaults(defineProps<IProps>(), {
  name: "山海经"
})
const current = ref<string>(null)
getBooksData(props.name).then((res) => contentsData.value = res.data.articles)

const handleClick = (title: string) => {
  const pinyinText = toPinyin(title)
  emits('click', pinyinText)
  current.value = pinyinText
}

</script>
<template>
  <div class="contents-title">·— 目录 —·</div>
  <div class="contents-container">
    <template v-for="item in contentsData">
      <div
          class="contents-item"
          :class="{'is-active':current === toPinyin(item.title)}"
          @click="handleClick(item.title)"
      >
        {{ item.title }}
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.contents-title {
  width: 100%;
  text-align: center;
  padding: 16px 0;
  font-size: 20px;
  color: $acc-red-dark;
}

.contents-container {
  display: flex;
  flex-wrap: wrap;
  padding: 12px 24px;
  gap: 8px;
  max-height: calc(100vh - 64px);
  overflow-y: auto;

  .contents-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    border-radius: 4px;
    border: 1px solid $acc-gold;
    font-size: 16px;
    writing-mode: vertical-rl;
    padding: 0 8px;
    transition: all ease-in .3s;
    cursor: pointer;

    &:hover,
    &.is-active {
      border: 1px solid transparent;
      background: $acc-red-dark;
      color: #fff;
    }
  }
}
</style>