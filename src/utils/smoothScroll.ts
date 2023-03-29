export const smoothScroll = (id) => {
    let ele = document.getElementById(id)
    ele.scrollIntoView({
        behavior: 'smooth'
    })
}