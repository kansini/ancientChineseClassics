<script lang="ts" setup>
import {ref} from "vue";

interface IImg {
  width?: number
  left?: number
  top?: number
  right?: number
  bottom?: number
}

withDefaults(defineProps<IImg>(), {
  width: 320
})
</script>
<template>
  <div class="acc-deco" :style="{width:`${width}px`}">
    <img src="../../assets/img/deco.svg">
  </div>
</template>


<style lang="scss" scoped>
.acc-deco {
  position: absolute;

  img {
    width: 100%;
  }
}
</style>