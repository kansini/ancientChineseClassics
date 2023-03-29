export const smoothScroll = (id: string) => {
    let ele = document.getElementById(id)
    !!ele && ele.scrollIntoView({
        behavior: 'smooth'
    })
}