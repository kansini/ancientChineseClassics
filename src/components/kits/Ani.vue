<template>
  <div :id="id"
       :style="{width:width ,height:height,background:background}"></div>
</template>

<script lang="ts" setup>
import lottie from "lottie-web"
import {uuid} from "@/utils/uuid"
import {onMounted} from "vue"

const props = defineProps({
  name: {
    type: String,
    default: "gift"
  },
  height: {
    type: String,
    default: '320px'
  },
  width: {
    type: String,
    default: '320px'
  },
  renderer: {
    type: String,
    default: 'svg'
  },
  background: {
    type: String,
    default: 'transparent'
  },
  AniOption: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const id = uuid('ani-')
const init = () => {
  const cv: any = document.getElementById(id)
  lottie.loadAnimation({
    container: cv, // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: `./aniList/${props.name}.json` // props.path, // the path to the animation json
  })
  // lottie.setDirection(0);
}
onMounted(() => {
  init()
})
</script>
