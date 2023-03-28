<script setup>
import {onMounted, ref} from 'vue';
import gsap from 'gsap';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
onMounted(() => {
  const horizontalSections = gsap.utils.toArray('section.horizontal')

  horizontalSections.forEach((sec, i) => {

    let thisPinWrap = sec.querySelector('.pin-wrap');
    let thisAnimWrap = thisPinWrap.querySelector('.animation-wrap');

    let getToValue = () => -(thisAnimWrap.scrollWidth - window.innerWidth);

    gsap.fromTo(thisAnimWrap, {
      x: () => thisAnimWrap.classList.contains('to-right') ? 0 : getToValue()
    }, {
      x: () => thisAnimWrap.classList.contains('to-right') ? getToValue() : 0,
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: () => "+=" + (thisAnimWrap.scrollWidth - window.innerWidth),
        pin: thisPinWrap,
        invalidateOnRefresh: true,
        //anticipatePin: 1,
        scrub: true,
        //markers: true,
      }
    });

  });
})

</script>
<template>
  <custom-cursor/>
  <top-menu/>
  <section>
    <cover/>
  </section>
  <section class="horizontal">
    <div class="pin-wrap">
      <div class="animation-wrap to-left">
        <detail name="天工开物"/>

      </div>
    </div>
  </section>
</template>
<style lang="scss">
html, body, section.horizontal {
  overflow-x: hidden;
}

section {
  width: 100%;
  height: 100%;
  position: relative;
  //background: url("../assets/img/main_bg.jpg");
  background-size: 100%;
}

section.horizontal {
  overflow-x: hidden;
}

section.horizontal .pin-wrap,
section.horizontal .animation-wrap {
  display: flex;
  position: relative;
  z-index: 1;
  height: 100vh;
}


section.horizontal .item {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}


section.horizontal .animation-wrap.to-right {
  counter-reset: item;
  float: left;
}

section.horizontal .animation-wrap.to-left {
  float: right;
}


</style>