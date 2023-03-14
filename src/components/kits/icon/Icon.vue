<template>
  <svg class="acc-icon" aria-hidden="true">
    <use :xlink:href="`#acc-${name}`"/>
  </svg>
</template>

<script>
import "//at.alicdn.com/t/c/font_3951271_v5m17k77vj.js"

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
}
</style>
