<script lang="ts" setup>
import {ref, reactive, onMounted} from "vue";


const loading = ref<boolean>(true)
const progress = ref<number>(0)
// Load all images and custom fonts in the project and combine their progress
const loadResources = async () => {
  const images = import.meta.globEager('@/assets/img/*.{svg,jpg}');
  const totalImages = Object.keys(images).length;
  let loadedResources = 0;
  const totalResources = totalImages + 1; // Add 1 for the custom font

  for (const imageKey in images) {
    const image = new Image();
    image.src = (images[imageKey] as any).default;
    image.onload = () => {
      loadedResources++;
      progress.value = Math.floor((loadedResources / totalResources) * 100);
    };
  }

  // Preload custom fonts
  const font = new FontFace('carved', 'url(./assets/fonts/carved.woff)', {display: 'swap'});
  font.loaded.then(() => {
    loadedResources++;
    progress.value = Math.floor((loadedResources / totalResources) * 100);
    loading.value = false
  });
  await font.load();
  document.fonts.add(font);

  // 将预加载的文件写入缓存
  // caches.open('my-cache').then((cache) => {
  //   cache.addAll(Array.from(Object.keys(images), key => (images[key] as any).default));
  //   cache.add('./assets/fonts/carved.woff');
  // });
};

onMounted(() => {
  loadResources();
});
const emit = defineEmits(['enter'])
const handleEnter = () => {
  emit('enter')
}
const motionOption = reactive({
  initial: {
    opacity: 0,
    // y: 240,
    scale: 0
  },
  enter: {
    opacity: 1,
    // y: 0,
    scale: 1
  }
})
</script>
<template>
  <transition name="slideUp">
    <div class="loading-container">
      <div class="loading-title"></div>
      <ani name="loading-brochure" width="160px" height="160px"/>
      <progress-bar
          :progress="progress"
          :loading="loading"
      >
        <acc-button
            v-if="!loading"
            v-motion
            :initial="motionOption.initial"
            :enter="motionOption.enter"
            @click="handleEnter"
        />
      </progress-bar>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: $acc-blue-dark;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;


  .loading-title {
    width: 230px;
    height: 48px;
    background: url("../../assets/img/title-white.svg");
    background-size: cover;
  }

  .btn-enter {
    color: #fff;
    font-family: "carved";
    font-size: 20px;
    cursor: pointer;
    padding: 8px 24px;
    //border: 1px solid #fff;
    border-radius: 40px;
    transition: all ease .4s;
    overflow: hidden;


    .btn-enter-inner {
      height: 24px;
      overflow: hidden;
      white-space: nowrap;
    }

    div {
      transform: skewY(0deg);
      transition: transform ease .6s;

      &:nth-child(2) {
        transform: translate3d(0, 12px, 0) skewY(40deg);
      }
    }

    &:hover {
      background: rgba(255, 255, 255, .2);
      //border: 1px solid rgba(255, 255, 255, 0);

      .btn-enter-inner {
        div {
          transform: perspective(100px) translate3d(0, -24px, 0) skewY(0deg);

          &:nth-child(1) {
            transform: perspective(100px) translate3d(0, -40px, 0) skewX(-40deg);
          }
        }
      }
    }
  }
}

</style>