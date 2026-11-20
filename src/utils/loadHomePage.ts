// The landing warmup and router share this import, so the first click need not
// start downloading the home page and its component dependencies from scratch.
export const loadHomePage = () => import("../views/Home.vue")
