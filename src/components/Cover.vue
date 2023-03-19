<script lang="ts" setup>
import {reactive} from "vue";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger);



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
      duration: 400
    }
  }
})
</script>
<template>
 <div class="cover">
    <div class="title"
         v-motion
         :initial="motionOption.initial"
         :enter="motionOption.enter"
    ></div>
    <div
        class="illustration"
        v-motion
        :initial="motionOption.initial"
        :enter="motionOption.enter"
        :delay="400"
    ></div>
  </div>
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
    background: url("../assets/img/title.svg") no-repeat center;
    background-size: cover;
  }

  .illustration {
    width: 156px;
    height: 242px;
    background: url("../assets/img/illustration-cover.svg") no-repeat center right;
    background-size: cover;
  }
}
</style>