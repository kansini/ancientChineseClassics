<script lang="ts" setup>
import {onMounted, onUnmounted, ref, computed, reactive} from "vue";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useWindowScroll} from "@vueuse/core";
import {useRouter} from "vue-router";
import {useBookName} from "@/stores/bookName";
import {smoothScroll} from "@/utils/smoothScroll";

const router = useRouter()
const bookName = useBookName().bookName

const showIntro = ref<boolean>(false)
const showContents = ref<boolean>(false)

const {x, y} = useWindowScroll()
const handleClickNav = (id) => {
  smoothScroll(id)
  setTimeout(() => {
    showContents.value = false
  })
}
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
  <back-to-top :visible="y > 300"/>
  <custom-cursor/>
  <top-menu
      :is-over="y > 480"
      @showIntro="showIntro = true"
      @showContents="showContents = true"
  />
  <cover/>
  <transition name="fadeIn">
    <mouse v-if="y < 80"/>
  </transition>
  <detail :name="bookName"/>
  <custom-modal v-model:visible="showContents" width="30%">
    <contents :name="bookName" @click="handleClickNav"/>
  </custom-modal>
  <custom-modal v-model:visible="showIntro">
    <intro :name="bookName"/>
  </custom-modal>
</template>
<style scoped lang="scss">

</style>