<script lang="ts" setup>
import {onMounted, onUnmounted, ref, computed, reactive} from 'vue';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useWindowScroll} from '@vueuse/core';
import {useRouter} from "vue-router";
import {useBookName} from '@/stores/bookName';

const router = useRouter()
const bookName = useBookName().bookName

const showIntro = ref<boolean>(false)
const showIndex = ref<boolean>(false)

const {x, y} = useWindowScroll()

gsap.registerPlugin(ScrollTrigger);
const main = ref();
const ctx = ref();

onMounted(() => {
  ctx.value = gsap.context(() => {
    // ScrollTrigger.create({
    //   trigger: '.cover',
    //   pin: true,
    //   start: 'center center',
    //   end: '+=240'
    // });
    // gsap.timeline({
    //   scrollTrigger: {
    //     trigger: ".cover",
    //     start: "center center",
    //     end: "bottom top",
    //     scrub: true,
    //     // pin: true
    //   }
    // }).to(".cover", {rotateY: -180})
  }, main.value);
});
onUnmounted(() => {
  ctx.value.revert();
});
</script>
<template>
  <custom-cursor/>
  <top-menu
      :is-over="y > 480"
      @showIntro="showIntro = true"
      @showContents="showIndex = true"
  />
  <cover/>
  <transition name="fadeIn">
    <mouse v-if="y < 80"/>
  </transition>
  <detail :name="bookName"/>
  <custom-modal v-model:visible="showIndex" width="30%">
    <contents :name="bookName"/>
  </custom-modal>
  <custom-modal v-model:visible="showIntro">
    <intro :name="bookName"/>
  </custom-modal>
</template>
<style scoped lang="scss">


#smooth-content {
  overflow: visible;
  width: 100%;
  background: url("../assets/img/main_bg.jpg");
  background-size: 100%;
  overflow-x: hidden;
}

.cover {
  transform-origin: left center;
  will-change: transform;
}

.detail {
  mix-blend-mode: color-burn;
  will-change: transform;
}

</style>