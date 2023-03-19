<script lang="ts" setup>
import {reactive} from "vue";
import {useRouter} from "vue-router";
import accIcon from "./kits/icon/Icon.vue"

const router = useRouter()

interface IMenu {
  name: string
  en?: string
  icon?: string
  method: (name?: string) => void
}

defineProps({
  isOver: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['toggle'])
const menuData = reactive<IMenu[]>([
  {
    name: "首",
    en: "Home",
    method: () => {
      router.push('/')
    }
  },
  {
    name: "介",
    en: "Intro",
    method: () => {}
  },
  {
    name: "目",
    en: "Index",
    method: () => {}
  },
])
</script>
<template>
  <div class="top-menu" :class="{'is-over':isOver}">
    <template v-for="item in menuData">
      <div class="top-menu-item"
           @click="item.method(item.name)"
      >
<!--        <acc-icon :name="item.icon"/>-->
        <div>{{ item.name }}</div>
        <div> {{ item.en }}</div>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.top-menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 64px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0);
  font-family: "carved";
  color: $acc-gold;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 999;
  transition: all ease .4s;
  pointer-events: none;

  .top-menu-item {
    position: relative;
    padding: 8px 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    pointer-events: all;

    div {
      transition: all ease-in .4s;
    }

    div:nth-child(2) {
      font-size: 12px;
      transform: scale(0.6) rotate(90deg) translate(-16px, -24px);
      position: absolute;
    }

    &:not(:last-child)::after {
      position: absolute;
      right: -8px;
      content: "";
      width: 1px;
      height: 20px;
      background: $acc-red-dark;
      transform: rotate(26deg);
    }

    &:hover {
      div {
        transform: scale(1.4) translate(0px, -4px);

        &:nth-child(2) {
          transform: scale(1.2) rotate(0deg) translate(-4px, 16px);
        }
      }
    }
  }

  &.is-over {
    background: rgba(255, 255, 255, .2);
    backdrop-filter: blur(2px);
  }
}
</style>