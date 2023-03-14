<script setup lang="ts">
import Detail from "../../components/Detail.vue"
import {reactive, ref} from "vue";
import TopMenu from "./TopMenu.vue"
import {useWindowScroll, useFullscreen} from '@vueuse/core'

const {isFullscreen, enter, exit, toggle} = useFullscreen()
const {x, y} = useWindowScroll()
const motionOption = reactive({
  initial: {
    opacity: 0,
    scale: 10,
    filter: 'blur(10px)',
  },
  enter: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 800
    }
  }
})
const cursorSize = ref('')
</script>

<template>
  <custom-cursor :size="cursorSize"/>
  <top-menu
      :is-over="y > 0"
      @toggle="toggle"
  />
  <div class="cover"
       v-motion
       :initial="motionOption.initial"
       :enter="motionOption.enter"
  >
    <div class="title"></div>
    <div class="illustration"></div>
  </div>
  <detail name="天工开物"/>
</template>

<style lang="scss" scoped>
.cover {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .title {
    width: 64px;
    height: 242px;
    background: url("../../assets/img/title.svg") no-repeat center;
    background-size: cover;
  }

  .illustration {
    width: 156px;
    height: 242px;
    background: url("../../assets/img/illustration-cover.svg") no-repeat center right;
    background-size: cover;
  }

}
</style>
