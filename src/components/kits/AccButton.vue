<script lang="ts" setup>
const $emit = defineEmits(['click'])
const handleToButton = () => {
  $emit('click')
}

interface IButton {
  text?: Array<string>
  direction?: string
}

withDefaults(defineProps<IButton>(), {
  text: () => ['开卷', '有益'],
  direction: 'bottom'
})
</script>
<template>
  <button class="tb-btn" @click="handleToButton">
    <div>
      <span :data-text="text[1]" :class="direction">
        {{ text[0] }}
      </span>
    </div>
  </button>
</template>

<style lang="scss" scoped>
button {
  border: none;
  outline: none;
  background: transparent;
  overflow: hidden;
}

.tb-btn {
  position: relative;
  padding: 8px 24px;
  height: 40px;
  min-width: 96px;
  border-radius: 60px;
  color: $acc-gold-light;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  transition: all ease .4s;
  font-family: "carved";

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 100%;
    left: 0;
    top: 0;
    background: $acc-gold-light;
    opacity: 0;
    transition: all ease .4s;
  }

  &:hover {
    color: $acc-blue-dark;
  }

  &:hover::before {
    opacity: 1;
    width: 100%;
  }

  div {
    position: relative;
    display: inline-block;
    vertical-align: top;
    overflow: hidden;

    span {
      position: relative;
      display: inline-block;
      transition: transform .4s;
      transform-origin: right top;

      &::after {
        content: attr(data-text);
        display: block;
        position: absolute;
        right: -150%;
        top: 0;
        transform: skewX(25deg);
        transition: transform 1s;
        transform-origin: right top;
      }
    }
  }

  &:hover span {
    transform: translateX(-150%);
  }

  &:hover span::after {
    transform: skewY(0deg);
  }

  .right {
    transform-origin: left top;

    &::after {
      left: -450%;
      top: 0;
    }
  }

  &:hover .right {
    transform: translateX(150%);
  }

  .top {
    transform-origin: left top;

    &::after {
      right: 0;
      top: -250%;
      transform: skewY(-15deg);
    }
  }

  &:hover .top {
    transform: translateY(250%);
  }

  .bottom {
    transform-origin: left top;

    &::after {
      right: 0;
      top: 250%;
      transform: skewY(15deg);
    }
  }

  &:hover .bottom {
    transform: translateY(-250%);
  }
}
</style>
