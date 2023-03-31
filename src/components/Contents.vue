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
const current = ref<string>('')
getBooksData(props.name).then((res) => {
  contentsData.value = res.data.articles
})

const handleClick = (title: string) => {
  const pinyinText = toPinyin(title)
  emits('click', pinyinText)
  current.value = pinyinText
}

</script>
<template>
  <custom-modal v-bind="$attrs" padding="0 40px;">
    <div class="contents-container">
      <div class="contents-title">
        <div class="contents-title-inner">{{ name }}</div>
      </div>
      <div class="contents-item-container">
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
    </div>
  </custom-modal>
</template>
<style lang="scss" scoped>
.contents-container {
  display: flex;
  flex-direction: row-reverse;
  margin: 16px 0;
  //margin-top: 40px;
  height: 100%;

  .contents-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 16px;
    font-size: 24px;
    color: $acc-red-dark;
    writing-mode: vertical-rl;
    border-left: 1px solid $acc-gold;
    border-right: 1px solid $acc-gold;

    .contents-title-inner {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      &::before,
      &::after {
        display: block;
        content: '';
        width: 32px;
        height: 32px;
        background: $acc-red-dark;
        -webkit-clip-path: polygon(50% 88%, 100% 66%, 100% 100%, 0 100%, 0 66%);
        clip-path: polygon(50% 88%, 100% 60%, 100% 100%, 0 100%, 0 60%);
      }

      &::before {
        transform: rotate(180deg);
      }
    }
  }

  .contents-item-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    max-height: calc(100vh - 16px);
    overflow-y: auto;

    .contents-item {
      display: flex;
      align-items: center;
      border-left: 1px solid $acc-gold;
      font-size: 18px;
      writing-mode: vertical-rl;
      padding: 16px;
      transition: all ease-in .3s;
      cursor: pointer;

      &:hover,
      &.is-active {
        border-left: 1px solid transparent;
        background: $acc-red-dark;
        color: #fff;
      }
    }

  }
}
</style>