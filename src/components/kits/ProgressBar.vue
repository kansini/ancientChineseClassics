<script lang="ts" setup>
import {ref, onMounted} from 'vue';
import {defineAsyncComponent} from 'vue';

const progress = ref(0);

// Load all images in the project
const loadImages = async () => {
  const images = import.meta.globEager('@/assets/img/*.{png,jpg,jpeg,gif}');
  const totalImages = Object.keys(images).length;
  let loadedImages = 0;

  for (const imageKey in images) {
    const image = new Image();
    image.src = (images[imageKey] as any).default;
    image.onload = () => {
      loadedImages++;
      progress.value = Math.floor((loadedImages / totalImages) * 100);
    };
  }
};

onMounted(() => {
  loadImages();
});
</script>
<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: progress + '%' }">
      <div class="progress-text">{{ progress }}%</div>
    </div>

  </div>
</template>

<style scoped>
.progress-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: #f0f0f0;
  z-index: 1000
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
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

