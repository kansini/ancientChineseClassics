<script setup lang="ts">
</script>

<template>
  <header>
    <HelloWorld msg="HELLO WORLD"/>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
  <RouterView/>
</template>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}
</style>
