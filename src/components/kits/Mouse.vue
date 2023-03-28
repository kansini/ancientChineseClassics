<script lang="ts" setup>

</script>
<template>
  <div class="acc-mouse-container">
    <div class="acc-mouse"></div>
    <span>上滑</span>
  </div>
</template>
<style lang="scss" scoped>
.acc-mouse-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  color: $acc-red-dark;
  font-size: 14px;
  font-family: "carved";

  .acc-mouse {
    display: flex;
    justify-content: center;
    padding-top: 8px;
    width: 24px;
    height: 40px;
    border-radius: 32px;
    border: 2px solid $acc-red-dark;
    margin-bottom: 4px;
     animation: mouse linear 1s infinite;

    &::before {
      display: block;
      content: '';
      width: 4px;
      height: 8px;
      border-radius: 4px;
      background: $acc-red-dark;
      animation: point linear .6s infinite;
    }

    @keyframes point {
      0%, 100% {
        opacity: 0;
        transform: translateY(4px);
      }
      50% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes mouse {
      0%, 100% {
        opacity: .8;
        transform: translateY(2px);
      }
      50% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}

</style>