<script lang="ts" setup>
interface IBookInfo {
  title: string
  author: string
  dynasty: string
}

defineProps({
  data: {
    type: Object as () => IBookInfo,
    default: () => ({
      title: '',
      author: '',
      dynasty: '',
    }),
  },
})
</script>
<template>
  <button type="button" class="book-spine" :aria-label="`阅读《${data.title}》`">
    <div class="book-spine-title">
      <div class="book-spine-name">{{ data.title }}</div>
      <div class="book-spine-info">{{ data.dynasty }}·{{ data.author }}</div>
    </div>
  </button>
</template>
<style lang="scss" scoped>
.book-spine {
  border: 0;
  flex: 0 0 auto;
  position: relative;
  width: 72px;
  height: 400px;
  background: $acc-blue;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  transition: all ease 0.6s;
  mix-blend-mode: color-burn;
  font-family: 'carved', serif;
  overflow: hidden;

  .book-spine-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 100%;

    .book-spine-name {
      color: #fff;
      font-size: 28px;
      transition: all ease-in 0.4s;
      writing-mode: vertical-rl;
      border: 0 solid rgba(0, 0, 0, 1);
      padding: 2px;
    }

    .book-spine-info {
      color: #fff;
      font-size: 18px;
      writing-mode: vertical-rl;
    }
  }

  &:focus-visible {
    outline: 3px solid $acc-gold;
    outline-offset: 5px;
  }

  &:hover {
    width: 280px;
    padding: 0 32px;
    align-items: flex-start;
    cursor: pointer;
    mix-blend-mode: difference;
    border-radius: 8px 12px 12px 8px;
    box-shadow:
      -1px 1px 0 1px rgba(255, 255, 255, 1),
      -2px 2px 0 1px rgba(0, 0, 0, 1),
      -3px 3px 0 1px rgba(255, 255, 255, 1),
      -4px 4px 0 1px rgba(255, 255, 255, 1),
      -5px 5px 0 1px rgba(0, 0, 0, 1),
      -6px 6px 0 1px rgba(255, 255, 255, 1),
      -7px 7px 0 1px rgba(255, 255, 255, 1),
      -8px 8px 0 1px rgba(0, 0, 0, 1),
      -9px 9px 0 1px rgba(255, 255, 255, 1);
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      right: 0;
      width: 32px;
      height: 100%;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 2px, transparent 2px);
      background-size: 40px 80px;
      border-left: 3px solid #000;
    }

    .book-spine-name {
      transform: scale(1.2);
      border: 1px solid rgba(255, 255, 255, 1);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 1),
        0 0 0 1px rgba(0, 0, 0, 1),
        0 0 0 4px rgba(255, 255, 255, 1);
    }
  }
}
</style>
<style lang="scss" scoped>
@media (max-width: 600px), (hover: none) {
  .book-spine {
    width: 64px;
    height: 290px;
    .book-spine-title .book-spine-name {
      font-size: 24px;
    }
    .book-spine-title .book-spine-info {
      font-size: 14px;
    }
    &:hover {
      width: 64px;
      padding: 0;
      align-items: center;
      mix-blend-mode: color-burn;
      border-radius: 8px;
      box-shadow: none;
      .book-spine-name {
        transform: none;
        border: none;
        box-shadow: none;
      }
      &::before {
        display: none;
      }
    }
  }
}
</style>
