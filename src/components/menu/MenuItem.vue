<script lang="ts" setup>

interface IMenuItem {
  name: string
  en: string
  url?: string
}

const emit = defineEmits(['click'])
const handleClick = () => {
  emit('click')
}
withDefaults(defineProps<IMenuItem>(),
    {
      name: '关',
      en: 'Close'
    })

</script>
<template>
  <a
      v-if="!!url"
      class="menu-item"
      @click="handleClick"
      :href="url"
      target="_blank"
  >
    <div>{{ name }}</div>
    <div>{{ en }}</div>
  </a>
  <div v-else class="menu-item" @click="handleClick">
    <div>{{ name }}</div>
    <div>{{ en }}</div>
  </div>
</template>
<style lang="scss" scoped>
.menu-item {
  position: relative;
  padding: 8px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: "carved";
  color: $acc-gold;
  font-size: 18px;

  div {
    transition: all ease-in .4s;
  }

  div:nth-child(2) {
    font-size: 12px;
    transform: scale(.6);
    position: absolute;
    //top: -8px;
    right: 12px;
    writing-mode: vertical-rl;
  }

  &:not(:first-child)::after {
    position: absolute;
    left: 0;
    content: "";
    width: 1px;
    height: 20px;
    background: $acc-red-dark;
    transform: rotate(26deg);
  }

  &:hover {
    div {
      transform: scale(1.4) translate(0px, -4px);

      &:nth-child(2) {
        transform: scale(1.2) rotate(-90deg) translate(-12px, -8px);
      }
    }
  }
}

</style>