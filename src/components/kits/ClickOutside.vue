<template>
   <div ref="target">
      <slot></slot>
   </div>
</template>

<script lang="ts">
import {onClickOutside} from '@vueuse/core'
import {ref, defineComponent} from 'vue'

export default defineComponent({
   name: "ClickOutside",
   setup(props, ctx) {
      const target = ref(null)
      onClickOutside(target, () => {
         ctx.emit('click-outside')
      })
      return {
         target
      }
   }
})
</script>

<style scoped>

</style>
