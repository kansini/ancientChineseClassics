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
  const font = new FontFace('CustomFont', 'url(./assets/fonts/carved.woff)');
  font.loaded.then(() => {
    loadedResources++;
    progress.value = Math.floor((loadedResources / totalResources) * 100);
  });
  await font.load();
  document.fonts.add(font);
};

onMounted(() => {
  loadResources();
});
</script>
<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: progress + '%' }">
      <div class="progress-text">{{ progress }}%</div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.progress-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: $acc-blue-dark;
  z-index: 1000
}

.progress-bar {
  height: 100%;
  background-color: $acc-gold;
  transition: width 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-text {
  font-size: 12px;
  color: #fff;
}
</style>
