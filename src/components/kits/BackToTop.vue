<script lang="ts" setup>
const emit = defineEmits(['click', 'mouseleave', 'mouseenter'])
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const handleClick = () => {
  emit('click')
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
const handleMouseenter = () => {
  emit('mouseenter')
}
const handleMouseleave = () => {
  emit('mouseleave')
}
</script>
<template>
  <transition name="scaleIn">
    <div class="back-to-top"
         v-if="visible"
         @click="handleClick"
         @mouseenter="handleMouseenter"
         @mouseleave="handleMouseleave"
    >
      <menu-item name="巅" en="top"/>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.back-to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 56px;
  height: 56px;
  border-radius: 32px;
  background: $acc-gold-light;
  mix-blend-mode: hard-light;
  z-index: 999;

  .menu-item{
    color: $acc-red;
  }
}
</style>