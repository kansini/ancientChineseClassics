<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useWindowScroll} from "@vueuse/core";
import {useRouter} from "vue-router";
import {useBookName} from "@/stores/bookName";
import {smoothScrollTo} from "@/utils/smoothScroll";
import BackToTop from "@/components/kits/BackToTop.vue";
import CustomCursor from "@/components/kits/CustomCursor.vue";
import TopMenu from "@/components/menu/TopMenu.vue";
import Cover from "@/components/Cover.vue";
import Mouse from "@/components/kits/Mouse.vue";
import Detail from "@/components/Detail.vue";
import Contents from "@/components/Contents.vue";
import Intro from "@/components/Intro.vue";
gsap.registerPlugin(ScrollTrigger);

const router = useRouter()
const bookName = useBookName().bookName
const showIntro = ref<boolean>(false)
const showContents = ref<boolean>(false)
const {x, y} = useWindowScroll()
const handleClickNav = async (id: string) => {
  smoothScrollTo(id)
  showContents.value = false
}
const main = ref();
const ctx = ref();

onMounted(async () => {
  await nextTick()
  ctx.value = gsap.context(() => {
    ScrollTrigger.create({
      trigger: '.cover',
      pin: true,
      start: 'center center',
      end: '+=80'
    });
    gsap.timeline({
      scrollTrigger: {
        trigger: ".cover",
        start: "center center",
        end: "bottom top",
        scrub: true,
        // pin: true
      }
    }).to(".cover", {
      opacity: 0,
      scale: 8,
      translateX: 240
    })
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
      :is-over="y > 560 && !showContents && !showIntro"
      @showIntro="showIntro = true"
      @showContents="showContents = true"
  />
  <cover/>
  <transition name="fadeIn">
    <mouse v-if="y < 80"/>
  </transition>
  <detail :name="bookName"/>
  <contents
      :name="bookName"
      v-model:visible="showContents"
      @click="handleClickNav"/>
  <intro :name="bookName" v-model:visible="showIntro"/>
</template>