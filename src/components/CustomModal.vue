<script lang="ts" setup>
const emit = defineEmits(['update:visible']);
const handleClose = () => {
  emit('update:visible', false);
}

interface IModal {
  visible: boolean
  width?: string | number
  padding?: string | number
}

withDefaults(defineProps<IModal>(), {
  visible: false,
  width: '100%'
})
</script>
<template>
  <click-outside @click-outside="handleClose">
    <transition name="fadeRight">
      <div
          class="acc-modal-container"
          v-if="visible"
          :style="{width:width,padding:padding}"
      >
        <menu-item @click="handleClose" name="退" en="Exit"/>
        <slot></slot>
      </div>
    </transition>
  </click-outside>
</template>

<style lang="scss" scoped>
.acc-modal-container {
  position: fixed;
  right: 0;
  top: 0;
  background: rgba(255, 255, 255, .2);
  height: 100vh;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 999;
  font-family: "carved";
  box-shadow: -4px 0 16px 0 rgba(0, 0, 0, .05);

  .menu-item {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>