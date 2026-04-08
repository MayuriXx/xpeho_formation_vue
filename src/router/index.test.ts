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

    // Ajouter le guard
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
    // Vérifier que l'utilisateur n'est pas authentifié
    expect(store.isAuthenticated).toBe(false)

    // Essayer d'accéder à /hello
    await router.push('/hello')
    // Le router devrait nous rediriger à /login
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should allow access to /hello when authenticated', async () => {
    const store = useUserStore()
    // Activer l'authentification
    store.isAuthenticated = true

    // Accéder à /hello
    await router.push('/hello')
    // Vérifier qu'on est bien sur /hello
    expect(router.currentRoute.value.path).toBe('/hello')
  })

  it('should allow access to /login without authentication', async () => {
    const store = useUserStore()
    // Vérifier que l'utilisateur n'est pas authentifié
    expect(store.isAuthenticated).toBe(false)

    // Accéder à /login
    await router.push('/login')
    // Vérifier qu'on reste sur /login
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should redirect / to /hello which then redirects to /login if not authenticated', async () => {
    const store = useUserStore()
    expect(store.isAuthenticated).toBe(false)

    // Accéder à /
    await router.push('/')
    // / redirige à /hello, qui redirige à /login car non authentifié
    expect(router.currentRoute.value.path).toBe('/login')
  })
})
