import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores/user.stores'
import Hello from '../components/Hello.vue'
import Login from '../components/Login.vue'

describe('Router Navigation Guards', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())

    const routes: RouteRecordRaw[] = [
      { path: '/login', component: Login, meta: { requiresAuth: false } },
      { path: '/hello', component: Hello, meta: { requiresAuth: true } },
      { path: '/', redirect: '/hello' },
    ]

    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    // Add the guard
    router.beforeEach((to) => {
      const store = useUserStore()

      if (to.meta.requiresAuth && !store.isAuthenticated) {
        return '/login'
      }

      return true
    })
  })

  it('should redirect to /login when accessing /hello without authentication', async () => {
    const store = useUserStore()
    // Check that the user is not authenticated
    expect(store.isAuthenticated).toBe(false)

    // Try to access /hello
    await router.push('/hello')
    // The router should redirect us to /login
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should allow access to /hello when authenticated', async () => {
    const store = useUserStore()
    // Enable authentication
    store.isAuthenticated = true

    // Access /hello
    await router.push('/hello')
    // Verify that we are on /hello
    expect(router.currentRoute.value.path).toBe('/hello')
  })

  it('should allow access to /login without authentication', async () => {
    const store = useUserStore()
    // Check that the user is not authenticated
    expect(store.isAuthenticated).toBe(false)

    // Access /login
    await router.push('/login')
    // Verify that we stay on /login
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should redirect / to /hello which then redirects to /login if not authenticated', async () => {
    const store = useUserStore()
    expect(store.isAuthenticated).toBe(false)

    // Access /
    await router.push('/')
    // / redirects to /hello, which redirects to /login as not authenticated
    expect(router.currentRoute.value.path).toBe('/login')
  })
})
