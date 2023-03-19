<script setup lang="ts">
import {ref} from "vue";
import {useWindowScroll, useFullscreen} from '@vueuse/core'

const {isFullscreen, enter, exit, toggle} = useFullscreen()
const {x, y} = useWindowScroll()

</script>

<template>
  <custom-cursor />
  <top-menu :is-over="y > 0"/>
  <cover />
  <detail name="天工开物" ref="detail"/>
</template>


