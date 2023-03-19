<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
// import {ScrollSmoother} from 'gsap-trial/ScrollSmoother';
import {useWindowScroll} from '@vueuse/core'

const {x, y} = useWindowScroll()


gsap.registerPlugin(ScrollTrigger);
const main = ref();
const ctx = ref();
const smoother = ref();

// const scrollTo = () => {
//   smoother.value.scrollTo('.detail', true, 'center center');
// };

onMounted(() => {
  ctx.value = gsap.context(() => {
    ScrollTrigger.create({
      trigger: '.cover',
      pin: true,
      start: 'center center',
      end: '+=400'
    });
  }, main.value);
});
onUnmounted(() => {
  ctx.value.revert();
});
</script>

<template>
  <custom-cursor/>
  <top-menu :is-over="y > 480"/>
  <div class="smooth-wrapper" ref="main">
    <div id="smooth-content">
      <div class="cover">
        <cover/>
      </div>
      <div class="detail">
        <detail name="天工开物"/>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">


#smooth-content {
  overflow: visible;
  width: 100%;
  //height: 80000px;
  background: url("../assets/img/main_bg.jpg");
  background-size: 100%;
}

.cover {
  will-change: transform;
}

.detail {
  mix-blend-mode: color-burn;
  will-change: transform;
}

</style>