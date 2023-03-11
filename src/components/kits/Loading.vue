<template>
  <transition name="slideUp">
    <div class="loading-container" v-if="loading">
      <div class="loading-title"></div>
      <ani name="loading-brochure" width="160px" height="160px"/>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import Ani from "./Ani.vue"

interface ILoading {
  loading: boolean
}

withDefaults(defineProps<ILoading>(), {
  loading: false
})
</script>

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
}
</style>