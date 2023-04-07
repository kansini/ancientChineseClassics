<script lang="ts" setup>
import {onClickOutside} from '@vueuse/core'
import {ref} from 'vue'

const target = ref(null)
const $emit = defineEmits(['click-outside'])
onClickOutside(target, () => {
  $emit('click-outside')
})
</script>
<template>
  <div ref="target">
    <slot></slot>
  </div>
</template>
