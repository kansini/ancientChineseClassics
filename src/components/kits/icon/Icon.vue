<template>
  <svg class="acc-icon" aria-hidden="true">
    <use :xlink:href="`#acc-${name}`"/>
  </svg>
</template>

<script>
import "./iconfont.js"

export default {
  name: "AccIcon",
  props: {
    name: {
      type: String,
      default: "home"
    }
  }
}
</script>

<style lang="scss" scoped>
.acc-icon {
  width: 1.4em;
  height: 1.4em;
  font-size: 14px;
  opacity: .6;
  transition: opacity ease-in-out .4s;

  &:hover {
    opacity: 1;
  }
}
</style>
