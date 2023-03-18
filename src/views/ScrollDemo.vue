<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import gsap from 'gsap-trial';
import {ScrollTrigger} from 'gsap-trial/ScrollTrigger';
import {ScrollSmoother} from 'gsap-trial/ScrollSmoother';
import {useWindowScroll} from '@vueuse/core'

const {x, y} = useWindowScroll()


gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const main = ref();
const ctx = ref();
const smoother = ref();

// const scrollTo = () => {
//   smoother.value.scrollTo('.detail', true, 'center center');
// };

onMounted(() => {
  ctx.value = gsap.context(() => {
    // create the smooth scroller FIRST!
    smoother.value = ScrollSmoother.create({
      smooth: 1, // seconds it takes to "catch up" to native scroll position
      effects: true, // look for data-speed and data-lag attributes on elements and animate accordingly
    });
    ScrollTrigger.create({
      trigger: '.cover',
      pin: true,
      start: 'center top',
      end: '+=100'
    });
  }, main.value);
});
onUnmounted(() => {
  ctx.value.revert();
});
</script>

<template>
  <custom-cursor/>
  <top-menu :is-over="y > 380"/>
  <div class="smooth-wrapper" ref="main">
    <div id="smooth-content">
      <div class="cover" data-speed="0.8">
        <cover/>
      </div>
  
      <detail name="天工开物"/>
    </div>
  </div>
</template>
<style scoped lang="scss">


#smooth-content {
  overflow: visible;
  width: 100%;
  height: 80000px;
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