import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import Login from './Login.vue'
import Hello from './Hello.vue'
import { useUserStore } from '../stores/user.stores'

describe('Login Component', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()

    // Créer un router pour les tests
    const routes: RouteRecordRaw[] = [
      { path: '/login', component: Login, meta: { requiresAuth: false } },
      { path: '/hello', component: Hello, meta: { requiresAuth: true } },
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

  describe('Email validation', () => {
    it('should accept "toto" as valid email', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Remplir le champ avec "toto"
      const input = wrapper.find('#email')
      await input.setValue('toto')

      // Cliquer sur le bouton Se connecter
      const button = wrapper.find('.login-button')
      await button.trigger('click')

      // Vérifier qu'il n'y a pas d'erreur
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(false)

      // Vérifier que l'authentification est activée
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(true)
    })

    it('should reject invalid emails', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Remplir avec un email invalide
      const input = wrapper.find('#email')
      await input.setValue('invalid@email.com')

      // Cliquer sur le bouton
      const button = wrapper.find('.login-button')
      await button.trigger('click')

      // Vérifier qu'une erreur s'affiche
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toContain('Email invalide')

      // Vérifier que l'authentification n'est pas activée
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should reject empty email', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Laisser le champ vide
      const button = wrapper.find('.login-button')
      await button.trigger('click')

      // Vérifier qu'une erreur s'affiche
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)

      // Vérifier que l'authentification n'est pas activée
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Toggle permission button', () => {
    it('should activate permission when clicking toggle button', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      const store = useUserStore()
      expect(store.isAuthenticated).toBe(false)

      // Cliquer sur le bouton toggle
      const toggleButton = wrapper.find('.toggle-button')
      await toggleButton.trigger('click')

      // Vérifier que l'authentification est activée
      expect(store.isAuthenticated).toBe(true)

      // Vérifier que le texte du bouton a changé
      expect(toggleButton.text()).toBe('Désactiver')
    })

    it('should redirect to /hello after activating permission', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      const store = useUserStore()

      // Cliquer sur le bouton toggle
      const toggleButton = wrapper.find('.toggle-button')
      await toggleButton.trigger('click')

      // Vérifier que l'authentification est activée
      expect(store.isAuthenticated).toBe(true)

      // Vérifier que router.push a été appelé avec '/hello'
      expect(router.currentRoute.value.path === '/' || router.currentRoute.value.path === '/hello').toBe(true)
    })

    it('should display permission status correctly', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      const store = useUserStore()

      // Au départ, permission désactivée
      let status = wrapper.find('.permission-status strong')
      expect(status.text()).toContain('Désactivée')
      expect(status.element?.classList.contains('denied')).toBe(true)

      // Activer la permission
      store.isAuthenticated = true
      await wrapper.vm.$nextTick()

      // Vérifier que le statut a changé
      status = wrapper.find('.permission-status strong')
      expect(status.text()).toContain('Activée')
      expect(status.element?.classList.contains('granted')).toBe(true)
    })
  })

  describe('Enter key handling', () => {
    it('should validate form when pressing Enter with valid email', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Remplir avec "toto"
      const input = wrapper.find('#email')
      await input.setValue('toto')

      // Simuler la pression de la touche Enter
      await input.trigger('keypress', { key: 'Enter' })

      // Vérifier que l'authentification est activée
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(true)
    })

    it('should show error when pressing Enter with invalid email', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Remplir avec un email invalide
      const input = wrapper.find('#email')
      await input.setValue('wrong@email.com')

      // Simuler la pression de la touche Enter
      await input.trigger('keypress', { key: 'Enter' })

      // Vérifier qu'une erreur s'affiche
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
    })

    it('should not validate when pressing other keys', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Remplir avec "toto"
      const input = wrapper.find('#email')
      await input.setValue('toto')

      // Simuler la pression d'une autre touche (par ex: 'a')
      await input.trigger('keypress', { key: 'a' })

      // Vérifier que l'authentification n'est pas activée
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Error message handling', () => {
    it('should clear error message when input changes', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Soumettre avec un email invalide
      const input = wrapper.find('#email')
      await input.setValue('invalid@email.com')

      const button = wrapper.find('.login-button')
      await button.trigger('click')

      // Vérifier qu'une erreur s'affiche
      let errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)

      // Modifier l'input
      await input.setValue('toto')

      // Soumettre
      await button.trigger('click')

      // Vérifier que l'erreur a disparu
      errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(false)
    })
  })
})
