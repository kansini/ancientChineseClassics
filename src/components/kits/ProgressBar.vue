<script lang="ts" setup>
import {ref, onMounted} from 'vue';

const progress = ref(0);

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
  });
  await font.load();
  document.fonts.add(font);

  // 将预加载的文件写入缓存
  caches.open('my-cache').then((cache) => {
    cache.addAll(Array.from(Object.keys(images), key => (images[key] as any).default));
    cache.add('./assets/fonts/carved.woff');
  });
};

onMounted(() => {
  loadResources();
});
defineProps({
  loading: {
    type: Boolean,
    default: true
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
  width: 240px;
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