import {createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import Landing from '../views/Landing.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'landing',
        component: Landing
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/book',
        name: 'book',
        component: () => import('../views/Book.vue')
    },
    {
        path: '/scroll',
        name: 'scroll',
        component: () => import('../views/ScrollDemo.vue')
    }

]
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export default router
