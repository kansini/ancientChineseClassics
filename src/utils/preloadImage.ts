/** Best-effort warmup: an optional image must never block entering the site. */
export function preloadImage(src: string, timeoutMs = 1200): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image()
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      image.onload = null
      image.onerror = null
      resolve()
    }
    const timer = setTimeout(finish, timeoutMs)
    // Register handlers before src: cached images can finish immediately.
    image.onload = finish
    image.onerror = finish
    image.src = src
    if (image.complete) finish()
  })
}
