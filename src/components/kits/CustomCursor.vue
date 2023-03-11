<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
import gsap from 'gsap'

gsap.registerPlugin(ScrollToPlugin)

interface Props {
  size?: string
  text?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '',
  text: 'click',
  color: 'rgba(255,0,0,1)'
})
const cursorInner = ref(null)
const cursorOuter = ref(null)
const onMouseMove = (e: any) => {
  const offset = props.size == '' ? 24 : 64
  // cursorInner.value.style.opacity = 1
  gsap.to(cursorOuter.value, 0.4, {
    x: e.clientX - offset,
    y: e.clientY - offset,
    opacity: 1
  })
  gsap.to(cursorInner.value, 0.1, {
    x: e.clientX - 4,
    y: e.clientY - 4,
    opacity: 1
  })
}
onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
})

</script>

<template>
  <div class="custom-cursor">
    <div ref="cursorOuter"
         class="custom-cursor-outer"
         :class="`cursor-${size}`"
         :style="{borderColor:color}"
    ></div>
    <div ref="cursorInner"
         class="custom-cursor-inner"
         :style="{background:color}"
    >
      {{ text }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-cursor {
  div {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;
  }

  .custom-cursor-outer {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 0, 0, .2);
    mix-blend-mode: color-burn;
  }

  .custom-cursor-inner {
    width: 8px;
    height: 8px;
    background: rgba(255, 0, 0, .85);
    border-radius: 50%;
    color: rgba(0, 0, 0, 0);
  }

  .cursor-large {
    width: 128px;
    height: 128px;
    background: rgba(255, 0, 0, .6);
    mix-blend-mode: color-burn;
  }

  .cursor-small {
    width: 32px;
    height: 32px;
    background: rgba(255, 0, 0, .6);
    mix-blend-mode: color-burn;
  }

  .hidden {
    background: rgba(255, 0, 0, 0) !important;
    color: rgba(0, 0, 0, .85);
  }
}


</style>
