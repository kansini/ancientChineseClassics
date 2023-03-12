<script lang="ts" setup>
import Ani from "./Ani.vue";
import {ref, defineEmits} from "vue";

interface ILoading {
  loading: boolean
  percent?: number
}

withDefaults(defineProps<ILoading>(), {
  loading: false,
  percent: 0
})
const loaded = ref<boolean>(false)
const emit = defineEmits(['enter'])
const handleEnter = () => {
  loaded.value = true
  emit('enter')
}
</script>
<template>
  <transition name="slideUp">
    <div class="loading-container" v-if="!loaded">
      <div class="loading-title"></div>
      <ani name="loading-brochure" width="160px" height="160px"/>
      <transition name="slideIn">
        <div class="btn-enter" @click="handleEnter" v-show="!loading">
          <div class="btn-enter-inner">
            <div>开卷</div>
            <div>有益</div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 80, 1);
  backdrop-filter: blur(20px);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;

  .loading-title {
    width: 230px;
    height: 48px;
    background: url("../../assets/img/title-white.svg");
    background-size: cover;
  }

  .btn-enter {
    color: #fff;
    font-family: "carved";
    font-size: 20px;
    cursor: pointer;
    padding: 8px 24px;
    border: 1px solid #fff;
    border-radius: 40px;
    transition: all ease .4s;
    overflow: hidden;


    .btn-enter-inner {
      height: 24px;
      overflow: hidden;
    }

    div {
      transform: skewY(0deg);
      transition: transform ease .6s;

      &:nth-child(2) {
        transform: translate3d(0, 12px, 0) skewY(40deg);
      }
    }

    &:hover {
      background: rgba(255, 255, 255, .3);
      //border: 1px solid rgba(255, 255, 255, 0);

      .btn-enter-inner {
        div {
          transform: perspective(100px) translate3d(0, -24px, 0) skewY(0deg);

          &:nth-child(1) {
            transform: perspective(100px) translate3d(0, -40px, 0) skewX(-40deg);
          }
        }
      }
    }
  }
}
</style>