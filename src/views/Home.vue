<script setup lang="ts">
import Book from "../components/Book.vue"

</script>

<template>
  <div class="home">
    <div class="title"></div>
    <div class="illustration"></div>
  </div>
  <Book name="天工开物"/>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .title {
    width: 64px;
    height: 242px;
    background: url("../assets/img/title.svg") no-repeat center;
    background-size: cover;
  }
  .illustration {
    width: 156px;
    height: 242px;
    background: url("../assets/img/illustration-cover.svg") no-repeat center right;
    background-size: cover;
  }

}
</style>
