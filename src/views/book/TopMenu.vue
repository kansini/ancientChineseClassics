<script lang="ts" setup>
import {reactive} from "vue";
import {useRouter} from "vue-router";
import accIcon from "../../components/kits/icon/Icon.vue"

const router = useRouter()

interface IMenu {
  name: string
  icon?: string
  method: Function
}

defineProps({
  isOver: {
    type: Boolean,
    default: false
  }
})
const menuData = reactive<Array<IMenu>>([
  {
    name: "首页",
    icon: "home",
    method: () => {
      router.push('/')
    }
  },
  {
    name: "简介",
    icon: "intro",
    method: (name: string) => {
      console.log(name)
    }
  },
  {
    name: "目录",
    icon: "index",
    method: (name: string) => {
      console.log(name)
    }
  },
  {
    name: "全屏",
    icon: "fullscreen",
    method: (name: string) => {
      console.log(name)
    }
  }
])
</script>
<template>
  <div class="top-menu" :class="{'is-over':isOver}">
    <template v-for="item in menuData">
      <div class="top-menu-item"
           @click="item.method(item.name)"
      >
        <acc-icon :name="item.icon"/>
        <!--        {{ item.name }}-->
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
  height: 40px;
  background: rgba(255, 255, 255, 0);
  font-family: "carved";
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 999;
  transition: all ease .4s;

  .top-menu-item {
    padding: 0 8px;
    cursor: pointer;
  }

  &.is-over {
    background: rgba(255, 255, 255, .1);
    backdrop-filter: blur(10px);
  }
}
</style>