import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Hello from '../components/Hello.vue'
import Login from '../components/Login.vue'
import { useUserStore } from '../stores/user.stores'

const routes: RouteRecordRaw[] = [
    { path: '/login', component: Login, meta: { requiresAuth: false } },
    { path: '/hello', component: Hello, meta: { requiresAuth: true } },
    { path: '/', redirect: '/hello' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from) => {
  const store = useUserStore()
  
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return '/login'
  }
  
  return true
})

export default router    