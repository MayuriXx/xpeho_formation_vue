import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Hello from '../components/Hello.vue'

const routes: RouteRecordRaw[] = [
    { path: '/', component: Hello },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router    