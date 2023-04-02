<script lang="ts" setup>
import {ref, computed} from "vue";
import {getBooksData} from "@/api/getBooksData";
import {NUM} from "@/enum/num";
import {PINYIN} from "@/enum/pinyin";

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

const handleClick = (index: number) => {
  const pinyin: Record<string, string> = PINYIN
  const id = `${pinyin[props.name]}${index}`
  emits('click', id)
  current.value = id
}
const getVolNum = (index: number) => {
  let numArr = (index + 1).toString().split('')
  let numCnArr = numArr.map((item: string) => {
    return NUM[parseInt(item)]
  })
  const volNum = numCnArr.join('')
  return volNum
}
const getId = (index: number) => {
  const pinyin: Record<string, string> = PINYIN
  return `${pinyin[props.name]}${index}`
}
</script>
<template>
  <custom-modal v-bind="$attrs" class="contents-modal">
    <div class="contents-container">
      <div class="contents-title">
        <div class="contents-title-inner">{{ name }}</div>
      </div>
      <div class="contents-item-container">
        <template v-for="(item,index) in contentsData">
          <div
              class="contents-item"
              :class="{'is-active':current === getId(index)}"
              @click="handleClick(index)"
          >
            <div class="contents-item-num">{{ getVolNum(index) }}</div>
            {{ item.title }}
          </div>
        </template>
      </div>
    </div>
  </custom-modal>
</template>
<style lang="scss">
.contents-modal {
  .acc-modal-container {
    padding: 16px 64px;
  }

  .contents-container {
    display: flex;
    flex-direction: row-reverse;
    height: 100%;
    border-top: 4px solid $acc-red;
    border-right: 4px solid $acc-red;
    border-bottom: 4px solid $acc-red;
    border-left: 3px solid $acc-red;

    .contents-title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 24px;
      color: $acc-red-dark;
      writing-mode: vertical-rl;
      border-left: 1px solid $acc-gold;

      .contents-title-inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 56px;

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
      background-image: linear-gradient(to right, $acc-gold 1px, transparent 1px);
      background-size: 48px 1px;

      .contents-item {
        display: flex;
        align-items: center;
        font-size: 18px;
        writing-mode: vertical-rl;
        padding: 16px 0;
        width: 48px;
        transition: all ease-in .3s;
        cursor: pointer;

        .contents-item-num {
          display: flex;
          justify-content: center;
          align-items: center;
          background: $acc-gold-dark;
          color: #fff;
          border-radius: 16px;
          font-size: 14px;
          padding: 8px 4px;
          margin-bottom: 8px;
          height: 72px;
          transition: all ease-in .3s;
        }


        &:hover,
        &.is-active {
          background: $acc-red-dark;
          color: $acc-gold-light;

          .contents-item-num {
            background: $acc-gold-light;
            color: $acc-gold-dark;
          }
        }
      }

    }
  }
}


</style>