<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
const props = defineProps<{ open: boolean; title: string; subtitle?: string }>()
const emit = defineEmits<{ (event: 'close'): void }>()
const dialog = ref<HTMLElement>()
let previous: HTMLElement | null = null
let previousOverflow = ''
function unlock() {
  document.body.style.overflow = previousOverflow
}
function handleKey(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
  if (event.key !== 'Tab' || !dialog.value) return
  const controls = Array.from(
    dialog.value.querySelectorAll<HTMLElement>(
      'button:not(:disabled),a[href],input,select,textarea,[tabindex="0"]',
    ),
  ).filter((el) => el.getClientRects().length)
  const first = controls[0],
    last = controls[controls.length - 1]
  if (
    event.shiftKey &&
    (document.activeElement === first || document.activeElement === dialog.value)
  ) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}
watch(
  () => props.open,
  async (open) => {
    if (open) {
      previous = document.activeElement as HTMLElement
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKey)
      await nextTick()
      const target = dialog.value?.querySelector<HTMLElement>('[data-autofocus]')
      ;(target || dialog.value)?.focus()
    } else {
      unlock()
      document.removeEventListener('keydown', handleKey)
      previous?.focus()
    }
  },
)
onBeforeUnmount(() => {
  if (props.open) unlock()
  document.removeEventListener('keydown', handleKey)
})
</script>
<template>
  <div v-if="open" class="reader-drawer-backdrop" @click.self="emit('close')">
    <aside
      ref="dialog"
      class="reader-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-drawer-title"
      tabindex="-1"
    >
      <header>
        <div>
          <p class="drawer-eyebrow">案头 · READING DESK</p>
          <h2 id="reader-drawer-title">{{ title }}</h2>
          <p v-if="subtitle" class="drawer-subtitle">{{ subtitle }}</p>
        </div>
        <button class="drawer-close" aria-label="关闭面板" @click="emit('close')">×</button>
      </header>
      <div class="reader-drawer-body"><slot /></div>
      <footer><span class="local-dot" />阅读设置、书签与摘录保存在此浏览器中</footer>
    </aside>
  </div>
</template>
<style scoped lang="scss">
.reader-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(30, 24, 19, 0.24);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
}
.reader-drawer {
  width: min(440px, 100%);
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--reader-panel, #fffaf1);
  color: var(--reader-ink, #30261f);
  box-shadow: -8px 0 48px #0002;
  outline: none;
  font-family: system-ui, sans-serif;
}
header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 28px 20px;
  border-bottom: 1px solid var(--reader-border, #dccab0);
}
.drawer-eyebrow {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--reader-muted, #806d55);
  margin-bottom: 12px;
}
h2 {
  font-family: serif;
  font-weight: 500;
  font-size: 28px;
}
.drawer-subtitle {
  font-size: 12px;
  color: var(--reader-muted);
  margin-top: 8px;
}
.drawer-close {
  border: 1px solid var(--reader-border);
  background: transparent;
  color: inherit;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 24px;
  cursor: pointer;
  flex: none;
}
.reader-drawer-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 24px 28px;
  overscroll-behavior: contain;
}
footer {
  font-size: 11px;
  color: var(--reader-muted);
  padding: 16px 24px;
  border-top: 1px solid var(--reader-border);
  display: flex;
  gap: 8px;
  align-items: center;
}
.local-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #a17c53;
}
@media (max-width: 480px) {
  header {
    padding: 22px 20px 18px;
  }
  .reader-drawer-body {
    padding: 20px;
  }
}
</style>
