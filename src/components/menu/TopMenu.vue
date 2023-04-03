<script lang="ts" setup>
import {reactive} from "vue";
import type {IMenu} from "@/interface";
import {useRouter} from "vue-router";

const router = useRouter()
const emit = defineEmits(['showIntro', 'showContents'])
defineProps({
  isOver: {
    type: Boolean,
    default: false
  }
})
const menuData = reactive<IMenu[]>([
  {
    name: "纲",
    en: "Home",
    method: () => {
      router.push('/home')
    }
  },
  {
    name: "略",
    en: "Intro",
    method: () => {
      emit('showIntro')
    }
  },
  {
    name: "录",
    en: "Contents",
    method: () => {
      emit('showContents')
    }
  },
  // {
  //   name: "仓",
  //   en: "Github",
  //   url: "https://github.com/kansini/tuibeitu"
  // }
])
</script>
<template>
  <div class="top-menu" :class="{'is-over':isOver}">
    <template v-for="item in menuData">
      <menu-item
          @click="item.method && item.method()"
          :name="item.name"
          :en="item.en"
          :url="item.url"
      />
    </template>
  </div>
</template>
<style lang="scss" scoped>
.top-menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  transition: all ease .4s;


  &.is-over {
    background: rgba(255, 255, 255, .2);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
}
</style>