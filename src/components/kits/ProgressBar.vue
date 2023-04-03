<script lang="ts" setup>
defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  progress: {
    type: Number,
    default: 0
  }
})
</script>
<template>
  <div class="progress-container" :class="{'is-loaded':!loading}">
    <div class="progress-bar" :style="{ width: progress + '%' }" v-if="progress > 0">
      <div class="progress-text" v-if="loading">{{ progress }}%</div>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.progress-container {
  width: 90px;
  height: 42px;
  border-radius: 42px;
  //background: $acc-gold-light;
  border: 1px solid #fff;
  overflow: hidden;
  transition: all ease-in .4s;

  .progress-bar {
    height: 100%;
    background-color: rgba(255, 255, 255, .2);
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;

    .progress-text {
      font-size: 12px;
      color: #fff;
    }
  }

  &.is-loaded {
    width: 90px;

    .progress-bar {
      background-color: rgba(255, 255, 255, 0);
    }
  }
}
</style>